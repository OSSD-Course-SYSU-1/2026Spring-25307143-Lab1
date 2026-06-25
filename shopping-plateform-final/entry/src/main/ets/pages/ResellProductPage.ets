/*
 * Copyright (c) Huawei Technologies Co., Ltd. 2024-2025. All rights reserved.
 */
import { camera, cameraPicker as picker } from '@kit.CameraKit';
import { image } from '@kit.ImageKit';
import { photoAccessHelper } from '@kit.MediaLibraryKit';
import { common, abilityAccessCtrl, Permissions } from '@kit.AbilityKit';
import { BusinessError } from '@kit.BasicServicesKit';

interface PurchasedProduct {
  id: string;
  name: string;
  price: string;
  image: string;
  description: string;
  purchaseDate: string;
}

@Entry
@Component
struct ResellProductPage {
  @State selectedProduct: PurchasedProduct | null = null;
  @State productImage: string = '';
  @State productName: string = '';
  @State productPrice: string = '';
  @State shippingMethod: string = '快递';
  @State shippingAddress: string = '';
  @State productDescription: string = '';
  @State showImagePicker: boolean = false;
  @State showProductList: boolean = true;
  
  // 模拟已购买商品数据
  @State purchasedProducts: PurchasedProduct[] = [
    {
      id: '1',
      name: '商品A',
      price: '99.00',
      image: '',
      description: '这是商品A的描述',
      purchaseDate: '2024-01-15'
    },
    {
      id: '2',
      name: '商品B',
      price: '199.00',
      image: '',
      description: '这是商品B的描述',
      purchaseDate: '2024-01-10'
    },
    {
      id: '3',
      name: '商品C',
      price: '49.00',
      image: '',
      description: '这是商品C的描述',
      purchaseDate: '2024-01-05'
    }
  ];

  private context: common.UIAbilityContext = getContext(this) as common.UIAbilityContext;

  // 选择商品进行转售
  selectProduct(product: PurchasedProduct) {
    this.selectedProduct = product;
    // 自动填充原商品信息
    this.productName = product.name;
    this.productPrice = product.price;
    this.productDescription = product.description;
    this.productImage = product.image;
    this.showProductList = false;
  }

  // 请求权限
  async requestPermissions(): Promise<boolean> {
    const permissions: Permissions[] = ['ohos.permission.CAMERA', 'ohos.permission.READ_MEDIA'];
    const atManager = abilityAccessCtrl.createAtManager();
    
    try {
      const grantStatus = await atManager.requestPermissionsFromUser(this.context, permissions);
      return grantStatus.authResults.every(result => result === 0);
    } catch (error) {
      const err = error as BusinessError;
      console.error('Request permissions failed: ' + err.message);
      return false;
    }
  }

  // 拍照
  async takePhoto() {
    try {
      const pickerProfile: picker.PickerProfile = {
        cameraPosition: camera.CameraPosition.CAMERA_POSITION_BACK
      };
      const pickerResult: picker.PickerResult = await picker.pick(this.context,
        [picker.PickerMediaType.PHOTO], pickerProfile);
      
      if (pickerResult && pickerResult.resultCode === 0 && pickerResult.resultUri) {
        this.productImage = pickerResult.resultUri;
        this.showImagePicker = false;
      }
    } catch (error) {
      const err = error as BusinessError;
      console.error('Take photo failed: ' + err.message);
    }
  }

  // 从图库选择
  async chooseFromGallery() {
    try {
      const photoSelectOptions: photoAccessHelper.PhotoSelectOptions = new photoAccessHelper.PhotoSelectOptions();
      photoSelectOptions.MIMEType = photoAccessHelper.PhotoViewMIMETypes.IMAGE_TYPE;
      photoSelectOptions.maxSelectNumber = 1;

      const photoPicker: photoAccessHelper.PhotoViewPicker = new photoAccessHelper.PhotoViewPicker();
      const photoSelectResult: photoAccessHelper.PhotoSelectResult = await photoPicker.select(photoSelectOptions);
      
      if (photoSelectResult && photoSelectResult.photoUris && photoSelectResult.photoUris.length > 0) {
        this.productImage = photoSelectResult.photoUris[0];
        this.showImagePicker = false;
      }
    } catch (error) {
      const err = error as BusinessError;
      console.error('Choose from gallery failed: ' + err.message);
    }
  }

  // 发布转售商品
  publishProduct() {
    if (!this.productImage || !this.productName || !this.productPrice || !this.shippingAddress) {
      console.error('Please fill all required fields');
      return;
    }

    // 这里应该调用API发布商品到市集
    console.log('Publishing resell product:', {
      image: this.productImage,
      name: this.productName,
      price: this.productPrice,
      shippingMethod: this.shippingMethod,
      address: this.shippingAddress,
      description: this.productDescription
    });

    // 发布成功后返回
    // 实际应用中应该显示成功提示并返回上一页
  }

  build() {
    Column() {
      // 标题栏
      Row() {
        if (this.showProductList) {
          Text($r('app.string.select_product'))
            .fontSize(20)
            .fontColor($r('sys.color.ohos_id_color_text_primary'))
            .fontWeight(FontWeight.Bold)
        } else {
          Row() {
            Button('←')
              .width(40)
              .height(40)
              .fontSize(20)
              .backgroundColor(Color.Transparent)
              .fontColor($r('sys.color.ohos_id_color_text_primary'))
              .onClick(() => {
                this.showProductList = true;
              })

            Text($r('app.string.edit_product'))
              .fontSize(20)
              .fontColor($r('sys.color.ohos_id_color_text_primary'))
              .fontWeight(FontWeight.Bold)
              .layoutWeight(1)
              .textAlign(TextAlign.Center)

            Blank().width(40)
          }
          .width('100%')
        }
      }
      .width('100%')
      .justifyContent(FlexAlign.Center)
      .height(56)
      .padding({ left: 16, right: 16 })

      if (this.showProductList) {
        // 商品选择列表
        this.ProductSelectList();
      } else {
        // 商品编辑表单
        this.ProductEditForm();
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor($r('sys.color.ohos_id_color_panel_bg'))
    .bindSheet($$this.showImagePicker, this.ImagePickerSheet(), {
      height: 200,
      backgroundColor: $r('sys.color.ohos_id_color_panel_bg'),
      dragBar: true
    })
  }

  @Builder
  ProductSelectList() {
    Scroll() {
      Column() {
        if (this.purchasedProducts.length === 0) {
          Column() {
            Image($r('app.media.ic_cart'))
              .width(64)
              .height(64)
              .opacity(0.5)

            Text($r('app.string.no_products'))
              .fontSize(14)
              .fontColor($r('sys.color.ohos_id_color_text_secondary'))
              .margin({ top: 16 })
          }
          .width('100%')
          .height('100%')
          .justifyContent(FlexAlign.Center)
        } else {
          ForEach(this.purchasedProducts, (product: PurchasedProduct) => {
            this.ProductItem(product);
          }, (product: PurchasedProduct) => product.id)
        }
      }
      .width('100%')
      .padding({ left: 16, right: 16, top: 16, bottom: 16 })
    }
    .layoutWeight(1)
  }

  @Builder
  ProductItem(product: PurchasedProduct) {
    Row() {
      Image(product.image || $r('app.media.ic_cart'))
        .width(80)
        .height(80)
        .borderRadius(8)
        .backgroundColor($r('sys.color.ohos_id_color_card_bg'))

      Column() {
        Text(product.name)
          .fontSize(16)
          .fontColor($r('sys.color.ohos_id_color_text_primary'))
          .fontWeight(FontWeight.Medium)
          .margin({ bottom: 8 })

        Text(`¥${product.price}`)
          .fontSize(14)
          .fontColor($r('app.color.activity_color'))
          .fontWeight(FontWeight.Bold)
          .margin({ bottom: 4 })

        Text(`购买日期: ${product.purchaseDate}`)
          .fontSize(12)
          .fontColor($r('sys.color.ohos_id_color_text_secondary'))
      }
      .alignItems(HorizontalAlign.Start)
      .layoutWeight(1)
      .margin({ left: 12 })

      Button($r('app.string.resell_product'))
        .height(36)
        .fontSize(12)
        .fontColor(Color.White)
        .backgroundColor($r('app.color.activity_color'))
        .borderRadius(18)
        .onClick(() => {
          this.selectProduct(product);
        })
    }
    .width('100%')
    .padding(16)
    .backgroundColor($r('sys.color.ohos_id_color_card_bg'))
    .borderRadius(8)
    .margin({ bottom: 12 })
  }

  @Builder
  ProductEditForm() {
    Scroll() {
      Column() {
        // 商品图片
        Column() {
          if (this.productImage) {
            Image(this.productImage)
              .width('100%')
              .height(200)
              .objectFit(ImageFit.Cover)
              .borderRadius(8)
              .onClick(() => {
                this.showImagePicker = true;
              })
          } else {
            Column() {
              Image($r('app.media.ic_cart'))
                .width(48)
                .height(48)
                .opacity(0.5)

              Text($r('app.string.product_image'))
                .fontSize(14)
                .fontColor($r('sys.color.ohos_id_color_text_secondary'))
                .margin({ top: 8 })
            }
            .width('100%')
            .height(200)
            .justifyContent(FlexAlign.Center)
            .backgroundColor($r('sys.color.ohos_id_color_card_bg'))
            .borderRadius(8)
            .onClick(() => {
              this.showImagePicker = true;
            })
          }
        }
        .width('100%')
        .margin({ bottom: 16 })

        // 商品名称
        this.InputItem($r('app.string.product_name'), this.productName, (value: string) => {
          this.productName = value;
        })

        // 商品价格
        this.InputItem($r('app.string.product_price'), this.productPrice, (value: string) => {
          this.productPrice = value;
        }, 'number')

        // 发货方式
        this.SelectItem($r('app.string.shipping_method'), this.shippingMethod, ['快递', '自提', '同城配送'], (value: string) => {
          this.shippingMethod = value;
        })

        // 发货地址
        this.InputItem($r('app.string.shipping_address'), this.shippingAddress, (value: string) => {
          this.shippingAddress = value;
        })

        // 商品描述
        Column() {
          Text($r('app.string.product_description'))
            .fontSize(14)
            .fontColor($r('sys.color.ohos_id_color_text_secondary'))
            .margin({ bottom: 8 })

          TextArea({ placeholder: $r('app.string.please_input'), text: this.productDescription })
            .width('100%')
            .height(120)
            .fontSize(14)
            .fontColor($r('sys.color.ohos_id_color_text_primary'))
            .backgroundColor($r('sys.color.ohos_id_color_card_bg'))
            .borderRadius(8)
            .onChange((value: string) => {
              this.productDescription = value;
            })
        }
        .width('100%')
        .alignItems(HorizontalAlign.Start)
        .margin({ bottom: 24 })

        // 发布按钮
        Button($r('app.string.publish'))
          .width('100%')
          .height(48)
          .fontSize(16)
          .fontColor(Color.White)
          .backgroundColor($r('app.color.activity_color'))
          .borderRadius(24)
          .onClick(() => {
            this.publishProduct();
          })
      }
      .width('100%')
      .padding({ left: 16, right: 16, top: 16, bottom: 16 })
    }
    .layoutWeight(1)
  }

  @Builder
  InputItem(label: Resource, value: string, onChange: (value: string) => void, type: string = 'text') {
    Column() {
      Text(label)
        .fontSize(14)
        .fontColor($r('sys.color.ohos_id_color_text_secondary'))
        .margin({ bottom: 8 })

      TextInput({ placeholder: $r('app.string.please_input'), text: value })
        .width('100%')
        .height(48)
        .fontSize(14)
        .fontColor($r('sys.color.ohos_id_color_text_primary'))
        .backgroundColor($r('sys.color.ohos_id_color_card_bg'))
        .borderRadius(8)
        .type(type === 'number' ? InputType.Number : InputType.Normal)
        .onChange(onChange)
    }
    .width('100%')
    .alignItems(HorizontalAlign.Start)
    .margin({ bottom: 16 })
  }

  @Builder
  SelectItem(label: Resource, value: string, options: string[], onChange: (value: string) => void) {
    Column() {
      Text(label)
        .fontSize(14)
        .fontColor($r('sys.color.ohos_id_color_text_secondary'))
        .margin({ bottom: 8 })

      Row() {
        Text(value)
          .fontSize(14)
          .fontColor($r('sys.color.ohos_id_color_text_primary'))
          .layoutWeight(1)

        Text('▼')
          .fontSize(12)
          .fontColor($r('sys.color.ohos_id_color_text_secondary'))
      }
      .width('100%')
      .height(48)
      .padding({ left: 16, right: 16 })
      .backgroundColor($r('sys.color.ohos_id_color_card_bg'))
      .borderRadius(8)
      .onClick(() => {
        // 显示选择对话框
        if (options.length > 0) {
          onChange(options[0]);
        }
      })
    }
    .width('100%')
    .alignItems(HorizontalAlign.Start)
    .margin({ bottom: 16 })
  }

  @Builder
  ImagePickerSheet() {
    Column() {
      Text($r('app.string.product_image'))
        .fontSize(16)
        .fontColor($r('sys.color.ohos_id_color_text_primary'))
        .fontWeight(FontWeight.Medium)
        .margin({ bottom: 24 })

      Row() {
        Button($r('app.string.take_photo'))
          .layoutWeight(1)
          .height(48)
          .fontSize(14)
          .fontColor(Color.White)
          .backgroundColor($r('app.color.activity_color'))
          .borderRadius(24)
          .onClick(() => {
            this.takePhoto();
          })

        Blank().width(16)

        Button($r('app.string.choose_from_gallery'))
          .layoutWeight(1)
          .height(48)
          .fontSize(14)
          .fontColor(Color.White)
          .backgroundColor($r('app.color.activity_color'))
          .borderRadius(24)
          .onClick(() => {
            this.chooseFromGallery();
          })
      }
      .width('100%')
      .padding({ left: 16, right: 16 })
    }
    .width('100%')
    .padding({ top: 16, bottom: 16 })
  }
}

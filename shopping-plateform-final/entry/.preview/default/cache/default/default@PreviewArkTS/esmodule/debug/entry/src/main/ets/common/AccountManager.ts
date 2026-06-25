/*
 * Copyright (c) Huawei Technologies Co., Ltd. 2024-2025. All rights reserved.
 */
// 用户信息接口
export interface UserAccount {
    userId: string; // 用户ID
    username: string; // 用户名
    account: string; // 账号
    password: string; // 密码
    avatar: string; // 头像
    phone: string; // 手机号
}
// 登录结果
export interface LoginResult {
    success: boolean;
    message: string;
    user?: UserAccount;
}
// 账号管理器
export class AccountManager {
    private static instance: AccountManager;
    // 固定的两个账号
    private readonly accounts: UserAccount[] = [
        {
            userId: 'user001',
            username: '原神牛逼',
            account: 'yuanshen',
            password: 'yuanshen123',
            avatar: 'https://img2.baidu.com/it/u=3092765660,555765568&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
            phone: '13800138001'
        },
        {
            userId: 'user002',
            username: '鸣潮牛逼',
            account: 'mingchao',
            password: 'mingchao123',
            avatar: 'https://img1.baidu.com/it/u=1819327567,2469389036&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
            phone: '13800138002'
        }
    ];
    // 当前登录用户
    private currentUser: UserAccount | null = null;
    private constructor() {
        // 尝试从持久化存储恢复登录状态
        this.restoreLoginState();
    }
    // 获取单例实例
    static getInstance(): AccountManager {
        if (!AccountManager.instance) {
            AccountManager.instance = new AccountManager();
        }
        return AccountManager.instance;
    }
    // 恢复登录状态
    private restoreLoginState() {
        try {
            const savedUserId = AppStorage.get<string>('currentUserId');
            if (savedUserId) {
                const user = this.accounts.find(u => u.userId === savedUserId);
                if (user) {
                    this.currentUser = user;
                }
            }
        }
        catch (error) {
            console.error('Restore login state failed:', error);
        }
    }
    // 登录
    login(account: string, password: string): LoginResult {
        const user = this.accounts.find(u => u.account === account && u.password === password);
        if (user) {
            this.currentUser = user;
            // 保存登录状态到AppStorage
            AppStorage.setOrCreate('currentUserId', user.userId);
            AppStorage.setOrCreate('isLogin', true);
            AppStorage.setOrCreate('username', user.username);
            AppStorage.setOrCreate('userAvatar', user.avatar);
            return {
                success: true,
                message: '登录成功',
                user: user
            };
        }
        else {
            // 检查账号是否存在
            const accountExists = this.accounts.some(u => u.account === account);
            if (accountExists) {
                return {
                    success: false,
                    message: '密码错误'
                };
            }
            else {
                return {
                    success: false,
                    message: '账号不存在'
                };
            }
        }
    }
    // 退出登录
    logout() {
        this.currentUser = null;
        AppStorage.setOrCreate('currentUserId', '');
        AppStorage.setOrCreate('isLogin', false);
        AppStorage.setOrCreate('username', '');
        AppStorage.setOrCreate('userAvatar', '');
    }
    // 获取当前登录用户
    getCurrentUser(): UserAccount | null {
        return this.currentUser;
    }
    // 获取当前用户ID
    getCurrentUserId(): string {
        return this.currentUser?.userId || '';
    }
    // 是否已登录
    isLogin(): boolean {
        return this.currentUser !== null;
    }
    // 获取所有账号（用于测试/演示）
    getAllAccounts(): UserAccount[] {
        const result: UserAccount[] = [];
        for (let i = 0; i < this.accounts.length; i++) {
            const u = this.accounts[i];
            const account: UserAccount = {
                userId: u.userId,
                username: u.username,
                account: u.account,
                password: '',
                avatar: u.avatar,
                phone: u.phone
            };
            result.push(account);
        }
        return result;
    }
    // 根据用户ID获取用户信息
    getUserById(userId: string): UserAccount | undefined {
        return this.accounts.find(u => u.userId === userId);
    }
}

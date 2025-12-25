export interface ApiClient {
    get<T>(url: string, params?: any): Promise<T>;
    post<T>(url: string, data?: any): Promise<T>;
    put<T>(url: string, data?: any): Promise<T>;
    delete<T>(url: string): Promise<T>;
}

export class MockApiClient implements ApiClient {
    private delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async get<T>(url: string, params?: any): Promise<T> {
        await this.delay(300); // Simulate network latency
        console.log(`[MockAPI] GET ${url}`, params);

        // Mock implementation for specific endpoints
        if (url === '/auth/session') {
            const session = localStorage.getItem('vips_current_session');
            return session ? JSON.parse(session) : null;
        }

        if (url.startsWith('/users/')) {
            const email = url.split('/')[2];
            const config = localStorage.getItem(`vips_config_${email}`);
            return config ? JSON.parse(config) : null;
        }

        throw new Error(`Mock endpoint not found: ${url}`);
    }

    async post<T>(url: string, data?: any): Promise<T> {
        await this.delay(300);
        console.log(`[MockAPI] POST ${url}`, data);

        if (url === '/auth/login') {
            const users = JSON.parse(localStorage.getItem('vips_users') || '[]');
            const user = users.find((u: any) => u.email === data.email && u.password === data.password);
            if (user) {
                const sessionData = { name: user.name, email: user.email, schoolName: user.schoolName, phone: user.phone };
                localStorage.setItem('vips_current_session', JSON.stringify(sessionData));
                return user as any;
            }
            throw new Error('Invalid email or password');
        }

        if (url === '/auth/register') {
            const users = JSON.parse(localStorage.getItem('vips_users') || '[]');
            if (users.find((u: any) => u.email === data.email)) {
                throw new Error('Email already registered');
            }
            const newUser = {
                name: data.name,
                email: data.email,
                password: data.password,
                schoolName: data.schoolName,
                phone: data.phone
            };
            users.push(newUser);
            localStorage.setItem('vips_users', JSON.stringify(users));
            const sessionData = { name: newUser.name, email: newUser.email, schoolName: newUser.schoolName, phone: newUser.phone };
            localStorage.setItem('vips_current_session', JSON.stringify(sessionData));
            return newUser as any;
        }

        if (url === '/auth/logout') {
            localStorage.removeItem('vips_current_session');
            return {} as any;
        }

        throw new Error(`Mock endpoint not found: ${url}`);
    }

    async put<T>(url: string, data?: any): Promise<T> {
        await this.delay(300);
        console.log(`[MockAPI] PUT ${url}`, data);

        if (url.startsWith('/users/')) {
            const email = url.split('/')[2];
            if (data.email && data.onboarded) {
                localStorage.setItem(`vips_config_${email}`, JSON.stringify(data));
                return data;
            }
        }

        throw new Error(`Mock endpoint not found: ${url}`);
    }

    async delete<T>(url: string): Promise<T> {
        throw new Error('Method not implemented.');
    }
}

// Singleton instance
export const api = new MockApiClient();

declare global {
    interface Window {
        captchaKey?: string;
        regeneratorRuntime: any;
        dynamicFunctions: (context?: HTMLElement) => void;
        grecaptcha: any;
        ym: (counterId: number, method: string, params?: any) => void;
        _tmr: Array<{ type: string, id: number, goal: string }>;
    }

    interface AjaxResponse {
        status: "success" | "error";
        data: {
            // сообщение для вывода на форме
            formMsg?: string;
            responseStatus?: string;
            inputMsg?: {};
            clearForm?: boolean;
            openModal?: string;
            reload?: boolean;
            redirect?: string;
            autoclose?: boolean;
        };
    }
    
}

export default global;

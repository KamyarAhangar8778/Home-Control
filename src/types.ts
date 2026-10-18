/**
 * @file types.ts
 * تعریف تمام type ها و interface های مشترک worker
 */

/** یک اکشن قابل اجرا بر روی پین هدف */
export interface RuleAction {
	targetPin: number;
	requiredHoldTime?: number;
	actionState: boolean;
	actionType?: number;
	delay?: number;
}

/** قانون مرتبط با یک پین (اکشن‌های high و low) */
export interface PinRule {
	highActions?: RuleAction[];
	lowActions?: RuleAction[];
}

/** تنظیمات یک پین در کانفیگ اصلی */
export interface PinConfig {
	id: string;
	type: string;
	pin: number;
	autoOffDelay?: number;
	rule?: PinRule;
}

/** وضعیت ذخیره‌شده یک پین */
export interface PinState {
	value?: boolean;
}

/** یک اتوماسیون زمانبندی‌شده */
export interface Automation {
	id: string;
	time: string;
	days: number[];
	enabled: boolean;
	repeatCount?: number;
	intervalMinutes?: number;
	conditionType?: 'time' | 'weather';
	city?: string;
	temperatureThreshold?: number;
	temperatureCondition?: 'greater' | 'less';
	actions: Array<{
		targetPin?: string;
		targetMacro?: string;
		actionOn?: boolean;
	}>;
}

/** یک ماکرو (دکمه سفارشی) */
export interface Macro {
	id: string;
	title: string;
	actions: Array<{
		targetPin: string;
		actionOn: boolean;
	}>;
}

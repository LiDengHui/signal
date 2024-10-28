// 创建数字信号
import { computed, signal } from '../lib/main.ts'

const temperature = signal<number>(20);
const humidity = signal<number>(50);

// 计算湿度和温度的函数
const comfortIndex = computed<number>(
  (temp: number, humid: number) => temp + humid,
  [temperature, humidity]
);

// 注册副作用
comfortIndex.effect(() => {
  console.log(`Comfort Index: ${comfortIndex.value}`);
});

// 更新信号的值
temperature.value = 25; // 控制台输出: Comfort Index: 75
humidity.value = 55; // 控制台输出: Comfort Index: 80
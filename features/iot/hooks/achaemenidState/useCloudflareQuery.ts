"use client";

import { useState, useEffect } from "react";

/**
 * این hook فقط وضعیت mount را مدیریت می‌کند.
 * وضعیت پین‌ها از ESP32 از طریق MQTT می‌آید (در services/mqtt/init.ts پارس می‌شود).
 * CloudFlare فقط برای UI Config (رنگ، نام، تنظیمات) استفاده می‌شود، نه برای وضعیت پین‌ها.
 */
export function useCloudflareQuery() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // refetchIot برای سازگاری با کد موجود نگه داشته شده
  const refetchIot = async () => {};

  return {
    mounted,
    refetchIot,
  };
}

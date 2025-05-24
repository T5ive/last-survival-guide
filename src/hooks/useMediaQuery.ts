import { useState, useEffect } from 'react';

/**
 * Hook นี้ใช้สำหรับตรวจสอบว่า media query ที่กำหนด ตรงกับขนาดหน้าจอหรือไม่
 * @param query string - media query string เช่น "(min-width: 640px)"
 * @returns boolean - true ถ้าตรงกับ query, false ถ้าไม่ตรง
 */
const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false); // ค่าเริ่มต้น จะอัปเดตภายหลังด้วย effect

  useEffect(() => {
    // ตรวจสอบว่า window มีอยู่ (สำหรับ SSR หรือ testing environment)
    if (typeof window === 'undefined') return;

    const mediaQueryList = window.matchMedia(query);

    // ฟังก์ชันที่อัปเดต state เมื่อ media query เปลี่ยนแปลง
    const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setMatches(event.matches);
    };

    // ตรวจสอบสถานะเริ่มต้น
    handleChange(mediaQueryList);

    // เพิ่ม event listener เมื่อขนาดหน้าจอเปลี่ยน
    mediaQueryList.addEventListener('change', handleChange);

    // ลบ event listener เมื่อ component ถูก unmount หรือ query เปลี่ยน
    return () => {
      mediaQueryList.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
};

export default useMediaQuery;

import Image from "next/image";
import styles from "./phone-frame.module.css";

/**
 * iPhone 16 Pro frame, black titanium.
 * Source: screenflow (Marvin Hulsmann)
 * https://github.com/marvinhuelsmann/homebrew-screenflow
 * License: MIT. Copyright (c) 2026 Marvin Hulsmann.
 * The PNG is 1350 by 2760. Its transparent screen cutout is
 * x 72, y 69, 1206 by 2622, with a 190 px corner radius.
 * The hardware, including the Dynamic Island, is part of the image.
 */
export function PhoneFrame({
  children,
  label,
  maxWidth = 280,
}: {
  children: React.ReactNode;
  label: string;
  maxWidth?: number;
}) {
  return (
    <div
      className={styles.device}
      style={{ "--phone-max": `${maxWidth}px` } as React.CSSProperties}
    >
      <div className={styles.stage}>
        <div className={styles.screen}>
          <div className={styles.well}>{children}</div>
        </div>
        {/* The frame sits over the screen so the cutout bezel and island stay even. */}
        <Image
          className={styles.frame}
          src="/images/devices/iphone-16-pro-black.png"
          alt=""
          width={1350}
          height={2760}
          unoptimized
          draggable={false}
        />
      </div>
      <span className="sr-only">{label}</span>
    </div>
  );
}

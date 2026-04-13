import type { ReactNode } from "react";
import { motion } from "framer-motion";

export default function ScrollAnimation({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false }}
      transition={{
        ease: "easeInOut",
        duration: 0.5,
        y: { duration: 1 },
      }}
    >
      <div>{children}</div>
    </motion.div>
  );
}

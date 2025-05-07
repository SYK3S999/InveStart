import { motion } from "framer-motion";
import { Lock } from "lucide-react";

export function BlockchainDemo() {
  const blockVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="p-6 bg-primary-50 rounded-xl shadow-lg border border-primary-200">
      <h3 className="text-xl font-bold text-primary-500 mb-4">تقنية Blockchain</h3>
      <div className="flex flex-col gap-4">
        {["التحقق من الهوية", "تسجيل العقود", "منع التجاوز"].map((item, index) => (
          <motion.div
            key={index}
            className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-neumorphic"
            variants={blockVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: index * 0.2 }}
          >
            <Lock className="h-5 w-5 text-primary-500" />
            <span className="text-gray-600">{item}</span>
          </motion.div>
        ))}
      </div>
      <p className="text-gray-600 text-sm mt-4">
        معاملات مشفرة وآمنة عبر Blockchain لضمان الشفافية والمصداقية.
      </p>
    </div>
  );
}
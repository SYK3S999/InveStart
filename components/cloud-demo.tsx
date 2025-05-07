import { motion } from "framer-motion";
import { Cloud } from "lucide-react";

export function CloudDemo() {
  const cloudVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  return (
    <div className="p-6 bg-primary-50 rounded-xl shadow-lg border border-primary-200">
      <h3 className="text-xl font-bold text-primary-500 mb-4">التخزين السحابي</h3>
      <motion.div
        className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-neumorphic"
        variants={cloudVariants}
        initial="hidden"
        animate="visible"
      >
        <Cloud className="h-5 w-5 text-primary-500" />
        <span className="text-gray-600">وثائق مشفرة مخزنة بأمان في السحابة</span>
      </motion.div>
      <p className="text-gray-600 text-sm mt-4">
        تخزين آمن مع وصول فوري للوثائق المطلوبة.
      </p>
    </div>
  );
}
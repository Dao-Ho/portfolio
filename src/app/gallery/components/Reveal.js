import { motion } from "framer-motion";

export const Reveal = ({ children }) => {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 75 },
                visible: { opacity: 1, y: 0 },
            }}
            intial="hidden"
            animate="visible"
        >
            {children}
        </motion.div>
    );
};

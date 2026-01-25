import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const AdminNotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground relative overflow-hidden">
      
      {/* Background glow elements */}
      <div className="absolute top-1/3 left-10 w-72 h-72 bg-primary/20 blur-3xl rounded-full -z-10" />
      <div className="absolute bottom-1/4 right-10 w-72 h-72 bg-accent-purple/20 blur-3xl rounded-full -z-10" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass p-10 rounded-3xl max-w-md text-center border border-border"
      >
        <h1 className="text-8xl font-heading font-bold gradient-text mb-4">
          404
        </h1>

        <p className="text-text-secondary text-lg mb-6">
          Oops! The page you're looking for doesn't exist.
        </p>

        <Link
          to="/"
          className="inline-block bg-gradient-to-r from-primary to-accent-purple px-6 py-3 rounded-full font-semibold text-white hover:glow-blue transition-all"
        >
          Go Back Home
        </Link>
      </motion.div>
    </div>
  );
};

export default AdminNotFound;

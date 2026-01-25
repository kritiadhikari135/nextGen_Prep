import { motion } from "framer-motion";


const StatsCard = ({ title, value, icon: Icon }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 hover:border-primary/50 transition-all duration-300"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {/* {trend && (
            <p className={`text-sm mt-2 ${trendUp ? "text-green-400" : "text-red-400"}`}>
              {trend}
            </p>
          )} */}
        </div>
        <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;

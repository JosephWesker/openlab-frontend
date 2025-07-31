// function ResizableContainer({ activeTab, tabs }) {
//   const containerRef = useRef(null);
//   const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

//   useEffect(() => {
//     if (containerRef.current) {
//       const { offsetWidth, offsetHeight } = containerRef.current;
//       setDimensions({ width: offsetWidth, height: offsetHeight });
//     }
//   }, [activeTab]);

//   return (
//     <motion.div
//       animate={{ width: dimensions.width, height: dimensions.height }}
//       transition={{ duration: 0.4, ease: "easeInOut" }}
//       className="bg-white rounded shadow-md p-6 text-center overflow-hidden"
//       style={{ display: "inline-block", verticalAlign: "top" }}
//     >
//       <div ref={containerRef} className="max-w-xs">
//         <AnimatePresence mode="wait">
//           <motion.div
//             key={activeTab}
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.3 }}
//           >
//             {tabs[activeTab].content}
//           </motion.div>
//         </AnimatePresence>
//       </div>
//     </motion.div>
//   );
// }

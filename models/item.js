const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    name: { type: String, required: true }, // University Name
    ranking: { type: String, required: true }, // Example: "#3 in CS, #2 in AI"
    status: { type: String, enum: ["applied", "will apply", "considering"], required: true }, // Your status
    category: { type: String, enum: ["Target", "Reach", "Safety"], required: true }, // Application category
    whyThisUniversity: { type: [String], required: true }, // Your reason for choosing it
    programOfInterest: { type: String, required: true }, 
    financialEstimate: {
        tuition: { type: String, required: true }, // Example: "$62,000/year"
        estimatedTotalCost: { type: String, required: true }, // Example: "~$80,000/year"
        scholarships: { type: String, required: false }, // Scholarship possibilities
    },
    dates: { type: [String], required: true }, 
    careerImpact: { type: [String], required: true }, // Alumni network, industry connections
    pros: { type: [String], required: true }, // Pros as an array
    cons: { type: [String], required: true }, // Cons as an array
    sources: { type: [String], required: true }, // Links to sources
    cImage: { type: String, required: false }, // University logo/image path
    image: { type: String, required: false }, // University logo/image path
   
});

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;

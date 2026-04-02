const Record = require('../models/record.model');

const getSummary = async (req, res, next) => {
    try {
        // 1. Total Income & Total Expenses
        const incomeResult = await Record.aggregate([
            { $match: { type: 'income' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        
        const expenseResult = await Record.aggregate([
            { $match: { type: 'expense' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        
        const totalIncome = incomeResult.length > 0 ? incomeResult[0].total : 0;
        const totalExpenses = expenseResult.length > 0 ? expenseResult[0].total : 0;
        const netBalance = totalIncome - totalExpenses;

        // 2. Category wise totals
        const categoryTotalsData = await Record.aggregate([
            { $group: { 
                _id: { category: '$category', type: '$type' }, 
                total: { $sum: '$amount' } 
            } }
        ]);

        const categoryTotals = categoryTotalsData.map(item => ({
            category: item._id.category,
            type: item._id.type,
            total: item.total
        }));

        // 3. Monthly Trends (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const trendsResult = await Record.aggregate([
            { $match: { date: { $gte: sixMonthsAgo } } },
            { $group: {
                _id: { 
                    year: { $year: "$date" }, 
                    month: { $month: "$date" } 
                },
                income: { $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] } },
                expense: { $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] } }
            } },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        const trends = trendsResult.map(item => ({
            month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
            income: item.income,
            expense: item.expense,
            net: item.income - item.expense
        }));

        // 4. Recent activity (last 5 records)
        const recentActivity = await Record.find()
            .sort({ date: -1, _id: -1 })
            .limit(5);

        res.status(200).json({
            status: 'success',
            data: {
                summary: {
                    totalIncome,
                    totalExpenses,
                    netBalance
                },
                categoryTotals,
                trends,
                recentActivity
            }
        });

    } catch (err) {
        next(err);
    }
};

module.exports = { getSummary };

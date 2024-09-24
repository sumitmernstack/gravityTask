db.sales.aggregate([
   
    {
      $unwind: "$items"
    },

    {
      $project: {
        store: 1,
        yearMonth: {
          $dateToString: { format: "%Y-%m", date: "$date" }
        },
        totalItemRevenue: {
          $multiply: ["$items.quantity", "$items.price"]
        },
        itemPrice: "$items.price"
      }
    },
  
    {
      $group: {
        _id: { store: "$store", month: "$yearMonth" },
        totalRevenue: { $sum: "$totalItemRevenue" },
        averagePrice: { $avg: "$itemPrice" }
      }
    },
  
    {
      $project: {
        _id: 0,
        store: "$_id.store",
        month: "$_id.month",
        totalRevenue: 1,
        averagePrice: { $round: ["$averagePrice", 2] } 
      }
    },
   
    {
      $sort: { store: 1, month: 1 }
    }
  ]);
  
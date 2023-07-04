#plot Data = close;

def percentChange = 100 * (close - close[1]) / close[1];
def quietAccumulation = percentChange > 0 and percentChange < 3;
def quietAccumulation5 = quietAccumulation and quietAccumulation[1] and quietAccumulation[2] and quietAccumulation[3] and quietAccumulation[4];


#plot quietAccumulationPlot = quietAccumulation;
#plot zeroPlot = 0;
plot quietAccumulation5Plot = quietAccumulation5;
quietAccumulation5Plot.setDefaultColor(color.RED);


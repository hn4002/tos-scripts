def isRollover = GetYYYYMMDD() != GetYYYYMMDD()[1];

def beforeStart = GetTime() < RegularTradingStart(GetYYYYMMDD());

def vol = if isRollover and beforeStart then volume else if beforeStart then vol[1] + volume else Double.NaN;

plot PreMarketVolume = vol / 1000;

#50 day average volume
def smaLength = 50;
def avg = SimpleMovingAvg(volume, smaLength);
def smaAvg;
if (IsNaN(avg)) {
    smaAvg = SimpleMovingAvg(volume, 10);
}
else {
    smaAvg = avg;
}

#factor to determine projected volume
#In numerator manually replace number of minutes elapsed
#def hoursElapsed = 5.80;
def minsElapsed = (GetTime() - RegularTradingStart(GetYYYYMMDD())) / (1000.0 * 60.0);
def factor = minsElapsed / (6.5 * 60.0);
def volumeProjectedForToday = volume / factor;
def volumeChange = Round((volumeProjectedForToday / smaAvg[1] - 1)  * 100.0, 2);


#Plot volume change
AddLabel(yes, volumeChange );
AddLabel(yes, GetTime() );
AddLabel(yes, RegularTradingStart(GetYYYYMMDD()) );
AddLabel(yes, minsElapsed, color.BLUE );
AddLabel(yes, factor, color.BLUE );
AddLabel(yes, volumeProjectedForToday, color.DARK_ORANGE );
AddLabel(yes, volumeChange, color.BLUE );
AddLabel(yes, smaAvg[1], color.DARK_GREEN);

plot minsElapsed1 = minsElapsed;
plot pctVolumeChange = volumeChange;
pctVolumeChange.AssignValueColor(if volumeChange > 1 then Color.GREEN else Color.RED);

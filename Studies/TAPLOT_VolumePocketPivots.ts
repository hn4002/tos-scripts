#Code by TA Plot https://twitter.com/TaPlot
#Please credit @TAPLOT twitter account if/when you share this code. Thank you!
#Date 08/28/2021 - 
#Date: 01/07/2022 - Added distribution day coloring
#Identifies up-day volume spikes that are pocket pivots.
#Based on the work of Gil Morales and Chris Kacher.
#http://www.wiley.com/WileyCDA/WileyTitle/productCd-0470616539,miniSiteCd-WILEYTRADING.html
#http://www.wiley.com/WileyCDA/WileyTitle/productCd-1118273028,miniSiteCd-WILEYTRADING.html
#This study checks volume to see if they met the pocket pivot criteria. The other criteria #(strong fundamentals, no wedging, constructive basing, how extended price is -etc.) need to #be evaluated separately.
#Volume colors:
#* 10 day pocket pivots are bright green bars
#* 5 day pocket pivots are blue
#* regular up days are dark green
#* down days are always red (no distribution)
#The indicator now colors volume bars (bright red) when the bar is considered a distribution bar.
#You can turn this off from indicator setting if you prefer. It is enabled by default.
#What is a distribution bar?
#A trading bar (daily in the example chart below) that closes lower than the previous bar on above than #average volume.
#Down bars on higher than average volume closing in the upper 40% of their trading range are considered #supportive action bars and do not count as distribution bars

#Notes: Please read authors book to fully understand how Pocket Pivots are to be used
#My implementation of it in this manner is to visually give me a sense of institutional
#buying pressure (demand).  This is not a trigger indicator. Read the authors books
#if you want to understand the difference between 
#a "buy-able" Pocket Pivot and non-buy-able one.

declare lower;
declare zerobase;

#PP5 = {"MAGENTA", "CYAN", "PINK", "LIGHT_GRAY", "ORANGE", "RED", "GREEN", "GRAY", "WHITE", default "Blue"};
input Vol_Dry_up_1 = -45;
input vol_Dry_up_2 = -60;
input VolAvglength = 50;
input Show_VolAvg = yes;
input Color_Distribution_Volume = yes;
input show_VolPercentChange = yes;
input Show_AvgDollarVol = yes;
input Show_UDRatio = yes;

# Volume functions
def DownVolume = If(close < close[1], volume, 0); #Tracking down days volume
def PocketPivot5 = Highest(DownVolume, 6); #volume lookback period (today + 5 prior days)
def PocketPivot10 = Highest(DownVolume, 11); #volume lookback period (today + 10 prior days)
#Check today's volume against PP10 and PP5;
def IsVolumeGreaterHighestDownVolume =   if (volume > PocketPivot10) then 10 else if (volume > PocketPivot5) then 5 else 0;

def CloseDown = close < close [1];
#if stock is down for the day, did it close in the lower 60% of the daily range?
def IsCloseInLowerHalfOfRange = if CloseDown and close < ((high - low) * .40 + low) then 1 else 0;

plot Vol = volume;
plot VolAvg = Average(volume, VolAvglength);

#volume percentage change
def VolPercentChange = 100 * ( volume - VolAvg ) / VolAvg;

#Volume Dry-up (VooDoo)
plot VoodooLine = if VolPercentChange <= -35 then VolAvg else Double.NaN;
VoodooLine.SetPaintingStrategy(PaintingStrategy.POINTS);
VoodooLine.SetLineWeight(2);
#VoodooLine.AssignValueColor(if VolPercentChange <= -60 then Color.ORANGE else if VolPercentChange <= -45 then CreateColor(0, 139, 139) else Color.gray );
VoodooLine.AssignValueColor(if VolPercentChange <= -60 then Color.orange else if VolPercentChange <= -45 then Color.YELLOW else if VolPercentChange <= -35 then CreateColor(0, 139, 139) else Color.gray );
VoodooLine.HideBubble();

Vol.SetPaintingStrategy(PaintingStrategy.HISTOGRAM);
Vol.SetLineWeight(3);
Vol.DefineColor("Up", Color.UPTICK);
Vol.DefineColor("Down", Color.DOWNTICK);
#If today is an up day, check volume against the last 10 down days (PP10)
#or the last 5 down days(PP5). Set the colors appropriatly after that.
Vol.AssignValueColor(if close > close[1] AND IsVolumeGreaterHighestDownVolume==10  then Vol.color("Up") else if close > close[1]  AND IsVolumeGreaterHighestDownVolume==5 then CreateColor(43, 152, 242) else if close > close[1] then color.dark_green else if CloseDown AND Vol > VolAvg AND IsCloseInLowerHalfOfRange AND Color_Distribution_Volume then color.red else if CloseDown then Vol.color("Down") else GetColor(1));
VolAvg.SetDefaultColor(GetColor(8));

#U/D Ratio
#===============================================================================#
#Define Down Days
def Down = (close[1] > close);
#Define Up Days
def Up = (close - close[1] >= 0);

def UpVol;
def downVol;

if BarNumber() < 50 {
    UpVol = Sum(if Up then volume else 0, 20);
    downVol = Sum(if Down then volume else 0, 20);
}
else {
    UpVol = Sum(if Up then volume else 0, 50);
    downVol = Sum(if Down then volume else 0, 50);
}

def updownRatio = UpVol / downVol;

#===============================================================================#
#Avg Dollar Vol
def avgDolVol;
if BarNumber() < 50 {
    avgDolVol = (close * Average(volume, 20)) / 1000000;
}
else {
    avgDolVol = (close * Average(volume, 50)) / 1000000;
    ;
}

#Labels
#===============================================================================#
#AvgVol
#Average Dollar Volume Label
AddLabel(Show_VolAvg, "AvgVol: " + Round(VolAvg/1000000, 2) + "M", color.light_GRAY);

#Volume percentage change Label
AddLabel(Show_VolPercentChange, "% Chg: " + Round(VolPercentChange, 2) + "%", color.light_GRAY);

#Average Dollar Volume Label
AddLabel(Show_AvgDollarVol, "Avg $ Vol: $" + Round(avgDolVol, 2) + "M", color.light_GRAY);

#Up down label
AddLabel(Show_UDRatio, "U/D Ratio: " + Round(updownRatio, 2), if updownRatio >= 1 then CreateColor(0, 165, 0) else if updownRatio < 1 then CreateColor(225, 0, 0) else Color.WHITE);

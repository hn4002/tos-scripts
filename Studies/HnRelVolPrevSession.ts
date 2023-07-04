# Comparison of Today's Volume at bar and Volume at time.
# Mobius
# V01.11.02.2017
# https://usethinkscript.com/threads/compare-volumes-of-today-and-yesterday-between-open-and-current-times.7894/#post-75597

input begin = 0930;
input end   = 1600;
def v = volume;
def bar = barNumber();
def xBar = if secondstilltime(begin)[1]>0 and secondsTillTime(begin) == 0
                     then bar
                     else xBar[1];
def pxBar = if xBar != xBar[1]
                         then xBar[1]
                         else pxBar[1];
def zxBar = if SecondsFromTime(begin) >= 0 and
                       SecondsTillTime(end) > 1
                    then 0
                    else if SecondsTillTime(end) == 0
                        then bar
                        else zxBar[1];
def pzxBar = if zxBar != zxBar[1]
                        then zxBar[1]
                        else pzxBar[1];
def pxBars = if bar == xBar
                   then pxBar
                   else if bar >= xBar
                        then pxBars[1] + 1
                        else pxBars[1];
def length = bar - (pxBars-1);
def RelVol = if bar >= xBar
                    then getValue(v, length)
                    else 0;
def pVol = if bar == xBar
                    then 0
                    else if bar > xBar
                         then pVol[1] + RelVol
                         else pVol[1];
def tVol = if SecondsTillTime(begin) == 0
                then v
                else if SecondsFromTime(begin) > 0  and SecondsTillTime(end) >= 0
                then compoundValue(1, tVol[1] + v, v)
                else tVol[1];
addlabel(1, "yesterdays volume at bar = " + RelVol +
          "  yesterdays volume = " + pVol +
          "  todays volume = " + tVol,
          if tVol > pVol
          then color.green
          else color.orange);
# End Code Previous Days Volume Comparison

import marked from 'marked'


export const explanatoryText = marked(`
This calculates a 1:1 put spread (not the 1:1.1 as described in *The Options Edge*)

Rehedge in first month ONLY if SPY has moved > 3% from the previous month.

|                   |                                                      |
|-------------------|------------------------------------------------------|
| Hedge instrument: | Long 1 year ATM SPY puts, short 3m 8.6% OTM SPY puts |
| Beta of DPYA:     | 0.99                                                 |
| Beta of IWDP:     | 0.99                                                 |
| Beta of IWDA:     | 0.89                                                 |
| Portfolio Beta:   | 1 (since I'm only hedging CSPX and IWDA)             |
`)
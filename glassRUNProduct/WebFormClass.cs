using System;
using System.Collections.Generic;
using System.Collections;
using System.Web.Http;
using System.Web;
using System.Data;
using System.Globalization;
using System.Linq;

namespace glassRUNProduct.WebAPI
{
    public class WebFormClass
    {
        public void knapshackfunction()
        {
            List<int> usedwt = new List<int>();
            //int[] trucksizes = { 2, 4, 8, 8 };
            //int[] value = { 1, 3, 5, 7, 9, 10 };
            //int[] wt = { 1, 2, 3, 3, 5, 6 };

            int[] trucksizes = { 16, 16, 8, 4 };
            int[] value = { 1, 2, 3, 4, 5, 6, 7 };
            int[] wt = { 2, 5, 6, 6, 7, 8, 10 };

            string r = bottomUpDP(value, wt, trucksizes);


            //int r1 = topDownRecursive(val, wt, 16);
            //Console.WriteLine(r);
            //Console.WriteLine(r1);
        }

        public string bottomUpDP(int[] val, int[] wt, int[] trucksizes)
        {
            int lastChangeIndex = 0;
            int lastChangeValue = 0;
            int lastWeight = 0;
            string Items = "";
            bool istrue = false;
           
            for (int t = 0; t < trucksizes.Length; t++)
            {
                Int64 totalWeight = 0;
                for (int v = 0; v < wt.Length; v++)
                {
                    totalWeight = totalWeight + wt[v];
                }

                HttpContext.Current.Response.Write("truck Size :" + trucksizes[t] + "<br /><br />");
                Items = Items + "For Truck :" + trucksizes[t];
                int W = trucksizes[t];
                int[,] K = new int[val.Length + 1, W + 1];

                for (int i = 0; i <= val.Length; i++)
                {

                    for (int j = 0; j <= W; j++)
                    {
                        if (i == 0 || j == 0)
                        {
                            K[i, j] = 0;
                            continue;
                        }
                        if (j - wt[i - 1] >= 0)
                        {
                            K[i, j] = Math.Max(K[i - 1, j], K[i - 1, j - wt[i - 1]] + val[i - 1]);
                        }
                        else
                        {
                            K[i, j] = K[i - 1, j];
                        }


                        if (i == val.Length)
                        {
                            if (lastChangeValue != K[i, j])
                            {
                                lastChangeValue = K[i, j];
                                lastChangeIndex = i;
                                lastWeight = j;
                            }
                        }
                    }
                }

                if(W > totalWeight)
                {
                    for (int p = lastWeight; p <= W; p++)
                    {
                        for (int u = 0; u < trucksizes.Length; u++)
                        {
                            if (u > t)
                            {
                                if (p == trucksizes[u])
                                {
                                    istrue = true;
                                    K = new int[val.Length + 1, W + 1];
                                    break;

                                }
                            }

                        }
                        if (istrue == true)
                        {
                            break;
                        }
                    }
                }
                
                HttpContext.Current.Response.Write("<table>");

                HttpContext.Current.Response.Write("<tr>");



                for (int i = 0; i < K.GetLength(1); i++)
                {
                    HttpContext.Current.Response.Write("<td> <b>");
                    HttpContext.Current.Response.Write(i);
                    HttpContext.Current.Response.Write("</b> </td>");
                }
                HttpContext.Current.Response.Write("</tr>");

                for (int i = 0; i < K.GetLength(0); i++)
                {
                    for (int j = 0; j < K.GetLength(1); j++)
                    {
                        HttpContext.Current.Response.Write("<td>");
                        HttpContext.Current.Response.Write(K[i, j] + "&nbsp; &nbsp; &nbsp; &nbsp;");
                        HttpContext.Current.Response.Write("</td>");
                    }
                    HttpContext.Current.Response.Write("</tr>");
                }
                HttpContext.Current.Response.Write("</table>");


                int index = 1;
                int rows = K.GetLength(0) - index;
                int column = K.GetLength(1) - index;

                for (int i = 0; i < K.GetLength(0); i++)
                {
                    rows = K.GetLength(0) - index;
                    int firstValue = Convert.ToInt16(K[rows, column]);
                    int secondValue = 0;
                    if (rows > 0)
                    {
                        secondValue = Convert.ToInt16(K[rows - 1, column]);
                    }
                    else
                    {
                        secondValue = firstValue;
                    }



                    if (firstValue != secondValue)
                    {
                        if (val.Length > 0 && wt.Length > 0)
                        {
                            int value = firstValue;

                            column = column - wt[rows - 1];


                            var valList = val.ToList();
                            valList.RemoveAt(rows - 1);
                            val = valList.ToArray();

                            var wtList = wt.ToList();
                            wtList.RemoveAt(rows - 1);
                            wt = wtList.ToArray();
                        }
                    }
                    else
                    {

                    }

                    index = index + 1;

                }


                HttpContext.Current.Response.Write("<br /><br /><br />");
                Items = Items + ") ";

            }


            return Items;
        }

        public int topDownRecursive(int[] values, int[] weights, int W)
        {
            //map of key(remainingWeight, remainingCount) to maximumValue they can get.
            Dictionary<Index, int> map = new Dictionary<Index, int>();
            return topDownRecursiveUtil(values, weights, W, values.Length, 0, map);
        }


        public int topDownRecursiveUtil(int[] values, int[] weights, int remainingWeight, int totalItems, int currentItem, Dictionary<Index, int> map)
        {
            //if currentItem exceeds total item count or remainingWeight is less than 0 then
            //just return with 0;
            if (currentItem >= totalItems || remainingWeight <= 0)
            {
                return 0;
            }

            //fom a key based on remainingWeight and remainingCount
            Index key = new Index();
            key.remainingItems = totalItems - currentItem - 1;
            key.remainingWeight = remainingWeight;

            //see if key exists in map. If so then return the maximumValue for key stored in map.
            if (map.ContainsKey(key))
            {
                return map.GetHashCode();
            }
            int maxValue;
            //if weight of item is more than remainingWeight then try next item by skipping current item
            if (remainingWeight < weights[currentItem])
            {
                maxValue = topDownRecursiveUtil(values, weights, remainingWeight, totalItems, currentItem + 1, map);
            }
            else
            {
                //try to get maximumValue of either by picking the currentItem or not picking currentItem
                maxValue = Math.Max(values[currentItem] + topDownRecursiveUtil(values, weights, remainingWeight - weights[currentItem], totalItems, currentItem + 1, map),
                        topDownRecursiveUtil(values, weights, remainingWeight, totalItems, currentItem + 1, map));
            }
            //memoize the key with maxValue found to avoid recalculation
            map.Add(key, maxValue);
            return maxValue;

        }
    }


    public class Index
    {
        public int remainingWeight;
        public int remainingItems;


        public Boolean equals(Object o)
        {
            if (this == o) return true;
            if (o == null) return false;

            Index index = (Index)o;

            if (remainingWeight != index.remainingWeight) return false;
            return remainingItems == index.remainingItems;

        }


        public int hashCode()
        {
            int result = remainingWeight;
            result = 31 * result + remainingItems;
            return result;
        }
    }
}
```
void pref(string need,int lps[])

    {

        int l=0;

        lps[0]=0;

        for(int i=1;i\<need.size();i++)

        {

            if(need[l]==need[i])

            {

                l++;

                lps[i]=l;

            }

            else

            {

                if(l!=0)

                {

                    l=lps[l-1];

                    i--;

                }

                else

                {lps[i]=0;}

            }

        }

    }

    int strStr(string hay, string need) {

       int n,m,r=0,l=0;

        n=hay.size();

        if(n==0)

        return 0;

        m=need.size();

        int lps[m];

        pref(need,lps);

        int cnt=0;

        while(r\<n)

        {

            if(hay[r]==need[l])

            {

                r++;

                l++;

            }

            if(l==m)

            {

                return r-l;

                //ans[cnt]=r-l

                //cnt++

                //l=lps[l-1]

            }

            else if(r\<n and hay[r]!=need[l])

            {

                if(l!=0)

                l=lps[l-1];

                else

                r++;    

            }

                

        }

        return -1;
```
 {  
int l=0;  
lps[0]=0;  
for(int i=1;i\<need.size();i++)  
{  
if(need[l]==need[i])  
{  
l++;  
lps[i]=l;  
}  
else  
{  
if(l!=0)  
{  
l=lps[l-1];  
i--;  
}  
else  
{lps[i]=0;}  
}  
}  
}  
int strStr(string hay, string need) {  
int n,m,r=0,l=0;  
n=hay.size();  
if(n==0)  
return 0;  
m=need.size();  
int lps[m];  
pref(need,lps);  
int cnt=0;  
while(r\<n)  
{  
if(hay[r]==need[l])  
{  
r++;  
l++;  
}  
if(l==m)  
{  
return r-l;  
//ans[cnt]=r-l  
//cnt++  
//l=lps[l-1]  
}  
else if(r\<n and hay[r]!=need[l])  
{  
if(l!=0)  
l=lps[l-1];  
else  
r++;  
}   }  
return -1;
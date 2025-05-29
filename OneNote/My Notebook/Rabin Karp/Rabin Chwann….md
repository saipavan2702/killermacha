```
 int d=256;

    long long int MOD=INT_MAX;

    int strStr(string hay, string need) {

        long long int n,m,p=0,t=0,h=1,j;

        n=hay.size();

        m=need.size();

        for(int i=0;i\<m-1;i++)

        {

          h=(h*d)%MOD;

        }

        for(int i=0;i\<m;i++)

        {

          p=(d*p+need[i])%MOD;

          t=(d*t+hay[i])%MOD;

        }

        for(int i=0;i\<n-m+1;i++)

        {

            if(p==t)

            {

                for(j=0;j\<m;j++)

                {

                    if(hay[i+j]!=need[j])

                    {

                        break;

                    }   

                }

             if(j==m)

             return i; 

            }

           if(i\<n-m)

           {

               t=(((t-hay[i]*h)*d)+hay[i+m])%MOD;

           }

           if(t\<0)

           {

               t=t+MOD;

           }

        }

        return -1;
```
 long long int MOD=INT_MAX;  
int strStr(string hay, string need) {  
long long int n,m,p=0,t=0,h=1,j;  
n=hay.size();  
m=need.size();  
for(int i=0;i\<m-1;i++)  
{  
h=(h*d)%MOD;  
}  
for(int i=0;i\<m;i++)  
{  
p=(d*p+need[i])%MOD;  
t=(d*t+hay[i])%MOD;  
}  
for(int i=0;i\<n-m+1;i++)  
{  
if(p==t)  
{  
for(j=0;j\<m;j++)  
{  
if(hay[i+j]!=need[j])  
{  
break;  
}  
}  
if(j==m)  
return i;  
}  
if(i\<n-m)  
{  
t=(((t-hay[i]*h)*d)+hay[i+m])%MOD;  
}  
if(t\<0)  
{  
t=t+MOD;  
}  
}  
return -1;
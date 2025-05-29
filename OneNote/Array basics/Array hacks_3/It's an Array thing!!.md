- We can use lower_bound /upper_bound to find index and frequency of a repeated element.

auto it : lower_bound(arr,arr+n,key)  
cout\<\<"The lower gives \>=key"\<\<(it-arr)\<\<endl;   As for upper bound it is used in same manner but it gives value "\>key".   Also the frequency can be found by placing "lb" in place of "it"(even at auto) and "ub" at upper bound  
function, subtracting it gives frequency.
  - This is to find no.of pair of elements whose sum is divisible by k 
map\<int,int\>freq;  
int ans=0;  
for(int i=0;i\<n;i++)  
{  
    int res=a[i]%k;  
    if(res!=0)  
    {  
        ans+=freq[k-(a[i]%k)];  
    }  
    else  
    {  
        ans+=freq[0];  
    }  
    freq[res]++;  
}  
return ans;
 - Bucket Sort 
int s=*min_element(nums.begin(),nums.end());  
int l=*max_element(nums.begin(),nums.end());  
int diff=l-s;
 
double len=(diff)*1.0/(n-1);
 
for(int i=0;i\<n;i++)  
int idx=(nums[i]-s)/len;
 - Merge sort

It is a recursive approach of sorting.   vector\<int\>a(n);  
** pass l=0,r=n-1;  
void mergesort(vector\<int\>a, int l, int r)  
{  
if(l\>=r)  
return;
 
int mid=l+(r-l)/2;  
mergesort(a,l,mid);  
mergesort(a,mid+1,r);  
merge(a,l,mid,r);  
}  
void merge(vector\<int\>a, int l, int mid, int r)  
{  
int u,v;  
u=mid-l+1;  
v=r-l;  
int s[u];  
int t[v];  
for(int i=0;i\<u;i++) //vector\<int\>s(a.begin()+l,a.begin()+mid+1)  
s[i]=a[l+i];
 
for(int i=0;i\<v;i++) //vector\<int\>t(a.begin()+mid+1,a.begin()+r+1)  
t[i]=a[mid+1+i];   int i=0,j=0,k=l;  
while(i\<u and j\<v)  
{  
if(s[i]\<=t[j])  
a[k++]=s[i++];  
else  
a[k++]=t[j++];  
}  
while(i\<u)  
a[k++]=s[i++];
 
while(j\<v)  
a[k++]=t[j++];  
}
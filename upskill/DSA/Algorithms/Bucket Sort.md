> [!summary]
> Bucket sort distributes values into ranges, sorts each range, and concatenates the buckets.

Map: [[Upskill/DSA/DSA|DSA]]
Connections: [[Upskill/DSA/Algorithms/Remainder Pair Counting|Remainder Pair Counting]]

## Implementations

```cpp

#include <iostream>
using namespace std;
void bucketsort(int a[], int n){ // function to implement bucket sort
   int max = a[0];
   for (int i = 1; i < n; i++)
      if (a[i] > max)
         max = a[i];
   int b[max], i;
   for (int i = 0; i <= max; i++) {
      b[i] = 0;
   }
   for (int i = 0; i < n; i++) {
      b[a[i]]++;
   }
   for (int i = 0, j = 0; i <= max; i++) {
      while (b[i] > 0) {
         a[j++] = i;
         b[i]--;
      }
   }
}
int main(){
   int a[] = {12, 45, 33, 87, 56, 9, 11, 7, 67};
   int n = sizeof(a) / sizeof(a[0]); // n is the size of array
   cout << "Before sorting array elements are: \n";
   for (int i = 0; i < n; ++i)
      cout << a[i] << " ";
   bucketsort(a, n);
   cout << "\nAfter sorting array elements are: \n";
   for (int i = 0; i < n; ++i)
      cout << a[i] << " ";
}

//Another method

#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

void bucketSort(vector<int>& nums) {
    int n = nums.size();
    if (n <= 1) return;

    int s = *min_element(nums.begin(), nums.end());
    int l = *max_element(nums.begin(), nums.end());
    int diff = l - s;

    if (diff == 0) return;

    double len = (diff) * 1.0 / (n - 1);
    vector<vector<int>> buckets(n);

    for (int i = 0; i < n; i++) {
        int idx = (nums[i] - s) / len;
        if (idx >= n) idx = n - 1; // Prevent index overflow for max value
        buckets[idx].push_back(nums[i]);
    }

    // Sort individual buckets and concatenate results
    nums.clear();
    for (int i = 0; i < n; i++) {
        sort(buckets[i].begin(), buckets[i].end());
        nums.insert(nums.end(), buckets[i].begin(), buckets[i].end());
    }
}

int main() {
    vector<int> nums = {42, 32, 23, 52, 25, 47, 51};
    bucketSort(nums);

    cout << "Sorted array: ";
    for (int num : nums)
        cout << num << " ";
    cout << endl;

    return 0;
}
```


#dsa #sorting

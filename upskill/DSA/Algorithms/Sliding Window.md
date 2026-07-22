> [!summary]
> Sliding window maintains a valid contiguous range while moving its left and right boundaries, often reducing nested scans to linear time.

Map: [[Upskill/DSA/DSA|DSA]]
Connections: [[Upskill/DSA/Algorithms/Dynamic Programming|Dynamic Programming]], [[Upskill/DSA/Algorithms/Binary Search|Binary Search]]

## Template

The standard template uses two pointers to control the current window.

```cpp
int function(){
	int i=0,j=0,ans=0;

	for (;j<N;++j) {
	    for (;invalid();++i) {}
	    ans=max(ans, j-i+1);
	}
	return ans;
}
```

## Example

```cpp
//https://leetcode.com/problems/longest-substring-without-repeating-characters/

class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        int i = 0, j = 0, N = s.size(), ans = 0, cnt[128] = {};
        for (; j < N; ++j) {
            cnt[s[j]]++;
            while (cnt[s[j]] > 1) cnt[s[i++]]--;
            ans = max(ans, j - i + 1);
        }
        return ans;
    }
};
```


#dsa #sliding-window

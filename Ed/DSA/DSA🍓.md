[[Binary search🐢]] is not just a usual finding element it can be used to find 5 different types of occurrences or positions.

[[Sliding window🍃]] is used to obtain results from a subarray or part of data structure.

[[Trees🌳]] 

[[Dyno-mic Programming🦖]] is used to memorize the redundant recursion calls and optimize the functionality of code.

[[Stacks & Queues🎍]] 
[[Hashing🗺️]]
[[CP & General🗂️]] 




### Notes

priority_queue struct usage for 2nd element
```cpp
struct Compare{
	bool operator()(const pair<int,int>&a, const pair<int,int>&b){
		if(a.first==b.first){
			return a.second<b.second;
		}
		return a.first<b.first;
	}
};

int main(){
	priority_queue<pair<int,int>, vector<pair<int,int>>, Compare>pq;

	auto cmp=[](const pair<int,int>&a, const pair<int,int>&b){
		if(a.first==b.first){
			return a.second<b.second;
		}
		return a.first<b.first;
	};
	priority_queue<pair<int,int>, vector<pair<int,int>>,
	decltype(cmp)>pq(cmp);	
}
Map: [[Upskill/ProgramLang/C++/C++|C++]]


> [!summary]
> Custom comparators control how C++ priority queues order compound values.

## Struct Comparator

```cpp
struct Compare {
    bool operator()(const pair<int, int>& a, const pair<int, int>& b) const {
        if (a.first == b.first) return a.second < b.second;
        return a.first < b.first;
    }
};

priority_queue<pair<int, int>, vector<pair<int, int>>, Compare> queue;
```

## Lambda Comparator

```cpp
auto compare = [](const pair<int, int>& a, const pair<int, int>& b) {
    if (a.first == b.first) return a.second < b.second;
    return a.first < b.first;
};

priority_queue<
    pair<int, int>,
    vector<pair<int, int>>,
    decltype(compare)
> queue(compare);
```


## Related

- [[Upskill/ProgramLang/C++/Memory and Parameters|Memory and Parameters]]
- [[Upskill/ProgramLang/Python vs C++ Performance|Python vs C++ Performance]]

#cpp #data-structures

# C++ Priority Queues

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

#cpp #data-structures

> [!summary]
> Independent requests should begin together or stream through boundaries instead of waiting on avoidable component-level dependencies.

Map: [[Upskill/WebDev/Web Development|Web Development]]

Think of we have a web page the user About section and Friends section need to fetch data separately on `/users/<id> and /users/<id>/friends`, If we fetch data in each component itself, it will cause the request waterfall issue.

To solve this basic solution is to make a call for both of them in a Profile section and pass the results.
```jsx
const Profile = ({ id }: { id: string }) => {
  const [user, setUser] = useState<User | undefined>();
  const [friends, setFriends] = useState<User[]>([]);

  useEffect(() => {
    const fetchUserAndFriends = async () => {
        const [user, friends] = await Promise.all([
          get<User>(`/users/${id}`),
          get<User[]>(`/users/${id}/friends`),
        ]);
        setUser(user);
        setFriends(friends);
    };
    fetchUserAndFriends();
  }, [id]);

  return (
    <>
      {user && <About user={user} />}
      <Friends users={friends} />
    </>
  );
};

// still depends on the slowest request to return, but faster than before.
```

Also we can use React lazy and suspense to render the components only when needed

```tsx
const UserDetailCard = React.lazy(() => import("./user-detail-card.tsx"));

export const Friend = ({ user }: { user: User }) => {
  return (
    <Popover placement="bottom" showArrow offset={10}>
      <PopoverTrigger>
        <button>
          <Brief user={user} />
        </button>
      </PopoverTrigger>
      <PopoverContent>
        <Suspense fallback={<div>Loading...</div>}>
          <UserDetailCard id={user.id} />
        </Suspense>
      </PopoverContent>
    </Popover>
  );
};
```

Now we can also use preload data before user interaction, as in above example the data is fetched when Trigger button is pressed or some user interaction. But we can fetch it beforehand.

```tsx
import { preload } from "swr";

const UserDetailCard = React.lazy(() => import("./user-detail-card.tsx"));
const Friend = ({ user }: { user: User }) => {

  const handleMouseEnter = () => {
    preload(`/user/${user.id}/details`, () => getUserDetail(user.id));
  };

  return (
    <NextUIProvider>
      <Popover placement="bottom" showArrow offset={10}>
        <PopoverTrigger>
          <button
            onMouseEnter={handleMouseEnter}
          >
            <Brief user={user} />
          </button>
        </PopoverTrigger>
        <PopoverContent>
          {/* UserDetailCard */}
        </PopoverContent>
      </Popover>
    </NextUIProvider>
  );
};
```

Now let's move to SSG(static site generation) for websites that doesn't change much.

```tsx
async function getQuotes(): Promise<QuoteType[]> {
  const res = await fetch(
    "https://api.quotable.io/quotes/random?tags=happiness,famous-quotes&limit=3"
  );

  return res.json();
}

export default async function Home() {
  const quotes = await getQuotes();
  return (
    <Quote initQuotes={quotes} />
  );
}
```

Now final one, React Server Component this allows rendering components on the server and streaming them to clients.

```tsx
import { Suspense } from "react";

async function UserInfo({ id }: { id: string }) {
  const user = await getUser(id);

  return (
    <>
      <About user={user} />
      <Suspense fallback={<FeedsSkeleton />}>
        <Feeds category={user.interests[0]} />
      </Suspense>
    </>
  );
}

async function Friends({ id }: { id: string }) {
  const friends = await getFriends(id);

  return (
    <div>
      <h2>Friends</h2>
      <div>
        {friends.map((user) => (
          <Friend user={user} key={user.id} />
        ))}
      </div>
    </div>
  );
}

export async function Profile({ id }: { id: string }) {
  return (
    <div>
      <h1>Profile</h1>
      <div>
        <div>
          <Suspense fallback={<UserInfoSkeleton />}>
            <UserInfo id={id} />
          </Suspense>
        </div>
        <div>
          <Suspense fallback={<FriendsSkeleton />}>
            <Friends id={id} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
```

In a scenario where Profile, UserInfo, and Friends are React Server Components.
Server-Side Execution: These components would execute on the server. This means the server handles fetching the user information and friends' data, rather than offloading these tasks to the client's browser.

## Related

- [[Upskill/WebDev/Frontend/Frontend Architecture|Frontend Architecture]]
- [[Upskill/WebDev/Frontend/Redux|Redux]]

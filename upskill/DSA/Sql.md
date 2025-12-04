**Basics**

```SQL
-- Knowing structure of table --
Describe table_name;

-- Naming output columns similar to AS --
select last_name "Surname" from employee;

-- Join column data using characters --
select last_name || ', ' || job_id from employee;

-- Searching for values in a set using IN --
select last_name from employee where job_id in (20,50);

-- Querying through dates --
select first_name from Employee where hire_date>='01-JAN-10' and hire_date<'01-JAN-11';

-- Wildcards in sql --
select last_name from employees where last_name like '__a%';

-- Some single row functions --
round(),initcap(),length()

-- Some group functions --
max(),min(),sum(),avg(),count(*)

-- Distinct ones --
SELECT COUNT(DISTINCT manager_id) "Number of Managers" FROM employees;

--  --

```

**Intermediate**

```SQL
-- Taking prompt from user using & --
SELECT last_name, salary FROM employees WHERE salary > &sal_amt;

-- Substitution in case of null --
SELECT NVL (Value, Substitute) FROM table;

-- Some setting value cases --
SET @EnterID := 2;
select Book_Title, Auth_ID from book where Auth_ID = @EnterID;

-- Case & When instances --
update Salary set sex= case when sex='m' then 'f' else 'm' end;

-- Having clause --
SELECT manager_id, MIN(salary) FROM employees WHERE manager_id IS NOT NULL GROUP BY manager_id HAVING MIN(salary) > 6000 ORDER BY MIN(salary) DESC;

--  --
```


- **Notes**
    
    % Represents zero or more characters  
    _ Represents a single character  
    [] Represents any single character within the brackets 
    ^ Represents any character not in the brackets 
    {} Represents any escaped character 
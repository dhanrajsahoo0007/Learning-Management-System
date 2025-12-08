"""
2115. Find All Possible Recipes from Given Supplies
Medium
You have information about n different recipes. You are given a string array recipes and a 2D string array ingredients. The ith recipe has the name recipes[i], and you can create it if you have all the needed ingredients from ingredients[i]. Ingredients to a recipe may need to be created from other recipes, i.e., ingredients[i] may contain a string that is in recipes.

You are also given a string array supplies containing all the ingredients that you initially have, and you have an infinite supply of all of them.

Return a list of all the recipes that you can create. You may return the answer in any order.

Note that two recipes may contain each other in their ingredients.

 

Example 1:

Input: recipes = ["bread"], ingredients = [["yeast","flour"]], supplies = ["yeast","flour","corn"]
Output: ["bread"]
Explanation:
We can create "bread" since we have the ingredients "yeast" and "flour".

"""

class Solution:
    def findAllRecipes(self, recipes: List[str], ingredients: List[List[str]], supplies: List[str]) -> List[str]:
        
        from collections import defaultdict, deque

        ingredient_indegree = defaultdict(int)
        recipie_graph = defaultdict(list)

        for recipie, recipie_ingredients in zip(recipes, ingredients):
            ingredient_indegree[recipie] = len(recipie_ingredients)
            for recipie_ingredient in recipie_ingredients:
                recipie_graph[recipie_ingredient].append(recipie)
        
        ans = []
        queue = deque(supplies)
        recipes = set(recipes)

        while queue:
            ingredient = queue.popleft()
            if ingredient in recipes:
                ans.append(ingredient)
            for recipie in recipie_graph.get(ingredient, []):
                ingredient_indegree[recipie] -= 1
                if ingredient_indegree[recipie] == 0:
                    queue.append(recipie)
        return ans
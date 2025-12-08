# DSA Service Content

## 📁 Content Location

All DSA problem files are located in: `/services/dsa/content/`

## 📊 Content Summary

- **Total Files**: 895 Python solution files
- **Topics**: 25 main categories
- **Format**: Python (.py) files with comprehensive solutions

## 🗂️ Topic Structure

```
content/
├── 00. Basic Python/
├── 01. Array/
├── 02. Prefix Sum/
├── 03. 2D Array - Matrix/
├── 04. HashMap/
├── 05. String/
├── 06. Pointers/
├── 07. Sliding Window/
├── 08. Binary Search/
├── 09. Stack and Queue/
├── 10. Heap/
├── 11. Recursion/
├── 12. Back Tracking/
├── 13. Linked List/
├── 14. Trees/
├── 15. Binary Search Tree/
├── 16. Tries/
├── 17. Graphs/
├── 18. Greedy/
├── 19. Interval/
├── 20. Dynamic Programming/
├── 21. Math & Geometry/
├── 22. Bit Manipulation/
├── 23. Sorting/
├── 24. Divide and Conquer/
└── 25. Design Questions/
```

## 🔗 Integration with DSA Service

The DSA microservice serves this content through its API:

- `GET /topics` - Lists all DSA topics from database
- `GET /topics/:id` - Returns specific topic with code examples
- `GET /categories` - Returns all categories

## 📝 Content Usage

The Python files in this directory serve as:

1. **Reference implementations** for DSA problems
2. **Code examples** for the API responses
3. **Educational content** for users
4. **Source material** for problem extraction

## 🚀 Extraction System

The content includes a Python-based extraction system:

- `dsa_parser.py` - Parses Python files to JSON
- `batch_extract.py` - Batch processing
- `extract_all.py` - Quick extraction script

See [README.md](./README.md) for full extraction system documentation.

## 🎯 Next Steps

1. **Extract problems to JSON** (optional):

   ```bash
   cd content
   python extract_all.py
   ```

2. **Import to database** (if needed):

   - Parse JSON output
   - Insert into `dsa_topics` table
   - Link with user progress tracking

3. **Serve via API**:
   - Content is already accessible via DSA service
   - API endpoints return data from database
   - Code examples can reference these files

---

**Note**: This content was migrated from `backend-bk/dsa` to the DSA microservice as part of the microservices architecture implementation.

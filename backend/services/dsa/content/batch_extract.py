"""
Batch DSA Problem Extractor

This script processes multiple DSA Python files and extracts them into JSON format.
Supports processing individual files, directories, or the entire DSA folder structure.
"""

import os
import sys
import json
from pathlib import Path
from typing import List, Optional
import argparse
from tqdm import tqdm

from dsa_parser import parse_dsa_file
from dsa_schema import DSACollection, Problem


class BatchExtractor:
    """Batch processor for DSA problem files."""
    
    def __init__(self, output_dir: str = "extracted"):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.problems: List[Problem] = []
        self.errors: List[dict] = []
    
    def process_file(self, filepath: Path) -> Optional[Problem]:
        """Process a single Python file."""
        try:
            problem = parse_dsa_file(str(filepath))
            return problem
        except Exception as e:
            self.errors.append({
                "file": str(filepath),
                "error": str(e)
            })
            return None
    
    def process_directory(self, directory: Path, recursive: bool = True) -> List[Problem]:
        """Process all Python files in a directory."""
        python_files = []
        
        if recursive:
            python_files = list(directory.rglob("*.py"))
        else:
            python_files = list(directory.glob("*.py"))
        
        # Filter out non-problem files
        python_files = [
            f for f in python_files 
            if not f.name.startswith('_') 
            and f.name not in ['dsa_parser.py', 'dsa_schema.py', 'batch_extract.py']
        ]
        
        problems = []
        print(f"\nProcessing {len(python_files)} files from {directory}...")
        
        for filepath in tqdm(python_files, desc="Extracting problems"):
            problem = self.process_file(filepath)
            if problem:
                problems.append(problem)
                self.problems.append(problem)
        
        return problems
    
    def save_individual_files(self, problems: List[Problem]) -> None:
        """Save each problem as an individual JSON file."""
        for problem in problems:
            output_file = self.output_dir / f"{problem.id}.json"
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(problem.model_dump(), f, indent=2, ensure_ascii=False)
        
        print(f"\n✓ Saved {len(problems)} individual JSON files to {self.output_dir}")
    
    def save_collection(self, filename: str = "all_problems.json") -> None:
        """Save all problems as a single collection file."""
        collection = DSACollection(
            problems=self.problems,
            metadata={
                "total_problems": str(len(self.problems)),
                "total_errors": str(len(self.errors))
            }
        )
        
        output_file = self.output_dir / filename
        collection.to_json_file(str(output_file))
        
        print(f"\n✓ Saved collection of {len(self.problems)} problems to {output_file}")
    
    def save_by_topic(self) -> None:
        """Save problems grouped by topic."""
        topics_dir = self.output_dir / "by_topic"
        topics_dir.mkdir(exist_ok=True)
        
        # Group problems by topic
        topic_groups = {}
        for problem in self.problems:
            for topic in problem.topics:
                if topic not in topic_groups:
                    topic_groups[topic] = []
                topic_groups[topic].append(problem)
        
        # Save each topic group
        for topic, problems in topic_groups.items():
            collection = DSACollection(problems=problems)
            filename = f"{topic.lower().replace(' ', '_')}.json"
            output_file = topics_dir / filename
            collection.to_json_file(str(output_file))
        
        print(f"\n✓ Saved {len(topic_groups)} topic-based collections to {topics_dir}")
    
    def print_summary(self) -> None:
        """Print extraction summary."""
        print("\n" + "="*60)
        print("EXTRACTION SUMMARY")
        print("="*60)
        print(f"Total problems extracted: {len(self.problems)}")
        print(f"Total errors: {len(self.errors)}")
        
        if self.errors:
            print("\nErrors:")
            for error in self.errors[:10]:  # Show first 10 errors
                print(f"  - {error['file']}: {error['error']}")
            if len(self.errors) > 10:
                print(f"  ... and {len(self.errors) - 10} more errors")
        
        # Topic distribution
        topic_counts = {}
        for problem in self.problems:
            for topic in problem.topics:
                topic_counts[topic] = topic_counts.get(topic, 0) + 1
        
        if topic_counts:
            print("\nProblems by topic:")
            for topic, count in sorted(topic_counts.items(), key=lambda x: x[1], reverse=True):
                print(f"  - {topic}: {count}")
        
        print("="*60 + "\n")


def main():
    parser = argparse.ArgumentParser(
        description="Extract DSA problems from Python files into JSON format"
    )
    parser.add_argument(
        "path",
        help="Path to file or directory to process"
    )
    parser.add_argument(
        "-o", "--output",
        default="extracted",
        help="Output directory for JSON files (default: extracted)"
    )
    parser.add_argument(
        "-r", "--recursive",
        action="store_true",
        default=True,
        help="Process directories recursively (default: True)"
    )
    parser.add_argument(
        "--individual",
        action="store_true",
        help="Save individual JSON files for each problem"
    )
    parser.add_argument(
        "--collection",
        action="store_true",
        help="Save all problems as a single collection file"
    )
    parser.add_argument(
        "--by-topic",
        action="store_true",
        help="Save problems grouped by topic"
    )
    parser.add_argument(
        "--all",
        action="store_true",
        help="Save in all formats (individual, collection, and by-topic)"
    )
    
    args = parser.parse_args()
    
    # Default to all formats if none specified
    if not (args.individual or args.collection or args.by_topic or args.all):
        args.all = True
    
    path = Path(args.path)
    extractor = BatchExtractor(output_dir=args.output)
    
    if path.is_file():
        print(f"Processing single file: {path}")
        problem = extractor.process_file(path)
        if problem:
            extractor.problems.append(problem)
    elif path.is_dir():
        extractor.process_directory(path, recursive=args.recursive)
    else:
        print(f"Error: Path not found: {path}")
        sys.exit(1)
    
    # Save in requested formats
    if args.all or args.individual:
        extractor.save_individual_files(extractor.problems)
    
    if args.all or args.collection:
        extractor.save_collection()
    
    if args.all or args.by_topic:
        extractor.save_by_topic()
    
    # Print summary
    extractor.print_summary()
    
    # Save error log if there were errors
    if extractor.errors:
        error_file = Path(args.output) / "errors.json"
        with open(error_file, 'w', encoding='utf-8') as f:
            json.dump(extractor.errors, f, indent=2)
        print(f"Error log saved to {error_file}")


if __name__ == "__main__":
    main()

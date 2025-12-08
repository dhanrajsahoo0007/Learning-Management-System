#!/usr/bin/env python3
"""
Quick Start Script for DSA Extraction

This script demonstrates how to extract all DSA problems.
"""

import sys
from pathlib import Path
from batch_extract import BatchExtractor


def main():
    print("=" * 70)
    print("DSA PROBLEM EXTRACTION - QUICK START")
    print("=" * 70)
    print()
    
    # Configuration
    dsa_root = Path(".")
    output_dir = "extracted"
    
    print(f"📁 DSA Root Directory: {dsa_root.absolute()}")
    print(f"📁 Output Directory: {output_dir}")
    print()
    
    # Ask user for confirmation
    print("This will extract ALL DSA problems from all folders.")
    print("This may take a few minutes depending on the number of files.")
    print()
    response = input("Continue? (y/n): ").strip().lower()
    
    if response != 'y':
        print("Extraction cancelled.")
        sys.exit(0)
    
    print()
    print("Starting extraction...")
    print()
    
    # Create extractor
    extractor = BatchExtractor(output_dir=output_dir)
    
    # Process all directories
    extractor.process_directory(dsa_root, recursive=True)
    
    # Save in all formats
    print("\nSaving extracted problems...")
    extractor.save_individual_files(extractor.problems)
    extractor.save_collection("all_problems.json")
    extractor.save_by_topic()
    
    # Print summary
    extractor.print_summary()
    
    # Save errors if any
    if extractor.errors:
        error_file = Path(output_dir) / "errors.json"
        import json
        with open(error_file, 'w', encoding='utf-8') as f:
            json.dump(extractor.errors, f, indent=2)
        print(f"\n⚠️  Error log saved to {error_file}")
    
    print("\n✅ Extraction complete!")
    print(f"\n📊 Results:")
    print(f"   - Individual files: {output_dir}/")
    print(f"   - Collection: {output_dir}/all_problems.json")
    print(f"   - By topic: {output_dir}/by_topic/")
    print()
    print("Next steps:")
    print("1. Review the extracted JSON files")
    print("2. Copy to frontend: cp -r extracted ../frontend/public/dsa-problems/")
    print("3. See FRONTEND_INTEGRATION.md for integration guide")
    print()


if __name__ == "__main__":
    main()

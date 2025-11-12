# Data Preparation

This folder contains scripts and notebooks for cleaning and preparing data.

## Purpose

Data preparation involves:

- Cleaning raw data
- Handling missing values
- Removing duplicates
- Normalizing data formats
- Feature engineering
- Data validation

## Contents

Typical files in this folder:

- `data_cleaning.ipynb` - Main data cleaning notebook
- `feature_engineering.ipynb` - Creating new features
- `data_validation.ipynb` - Checking data quality
- `cleaning_utils.py` - Reusable cleaning functions

## Workflow

1. **Load** raw data from `1_datasets/raw_data/`
2. **Clean** and transform the data
3. **Validate** the results
4. **Save** cleaned data to `1_datasets/cleaned_data/`
5. **Document** all changes and decisions

## Documentation

For each cleaning step, document:

- What was changed
- Why it was changed
- Impact on the dataset
- Any assumptions made

## Best Practices

- Keep a log of all transformations
- Make cleaning reproducible (use scripts, not manual edits)
- Test your cleaning pipeline
- Document edge cases
- Preserve data lineage

## Next Steps

After data preparation, proceed to:

- Data exploration (`3_data_exploration/`)
- Data analysis (`4_data_analysis/`)

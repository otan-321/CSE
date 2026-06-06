#!/bin/bash

# ============================================================
# CSE Reviewer — Study Data Deploy Script
# Copies all study JSON files to your project and pushes
# to GitHub (Vercel auto-deploys from the main branch).
# ============================================================

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}==============================${NC}"
echo -e "${YELLOW}  CSE Reviewer — Deploy Script ${NC}"
echo -e "${YELLOW}==============================${NC}"

# ── CONFIGURE THIS ────────────────────────────────────────────
# Path to your local CSE project folder
PROJECT_DIR="/mnt/c/Users/tantan/Documents/CSE"
# ─────────────────────────────────────────────────────────────

# Check if the project directory exists
if [ ! -d "$PROJECT_DIR" ]; then
  echo -e "${RED}ERROR: Project folder not found at: $PROJECT_DIR${NC}"
  echo "Please update the PROJECT_DIR variable in this script."
  exit 1
fi

echo -e "\n${GREEN}✔ Project folder found: $PROJECT_DIR${NC}"

# Create study data directories inside the project
echo -e "\n${YELLOW}Creating study data directories...${NC}"
mkdir -p "$PROJECT_DIR/src/data/study/verbal"
mkdir -p "$PROJECT_DIR/src/data/study/numerical"
mkdir -p "$PROJECT_DIR/src/data/study/analytical"
mkdir -p "$PROJECT_DIR/src/data/study/clerical"
mkdir -p "$PROJECT_DIR/src/data/study/general"
echo -e "${GREEN}✔ Directories created${NC}"

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Copy all study JSON files
echo -e "\n${YELLOW}Copying study JSON files...${NC}"

FILES=(
  "src/data/study/verbal/vocabulary.json"
  "src/data/study/verbal/grammar.json"
  "src/data/study/verbal/reading-comprehension.json"
  "src/data/study/verbal/analogy.json"
  "src/data/study/verbal/logic.json"
  "src/data/study/numerical/basic-math.json"
  "src/data/study/numerical/word-problems.json"
  "src/data/study/numerical/number-series.json"
  "src/data/study/numerical/data-interpretation.json"
  "src/data/study/analytical/analytical-ability.json"
  "src/data/study/clerical/clerical-ability.json"
  "src/data/study/general/philippine-constitution.json"
  "src/data/study/general/ra-6713.json"
  "src/data/study/general/peace-human-rights.json"
  "src/data/study/general/environmental-management.json"
)

COPIED=0
FAILED=0

for FILE in "${FILES[@]}"; do
  SRC="$SCRIPT_DIR/$FILE"
  DEST="$PROJECT_DIR/$FILE"
  if [ -f "$SRC" ]; then
    cp "$SRC" "$DEST"
    echo -e "${GREEN}  ✔ Copied: $FILE${NC}"
    ((COPIED++))
  else
    echo -e "${RED}  ✘ Missing: $FILE${NC}"
    ((FAILED++))
  fi
done

echo -e "\n${GREEN}✔ Files copied: $COPIED${NC}"
if [ $FAILED -gt 0 ]; then
  echo -e "${RED}✘ Files missing: $FAILED${NC}"
fi

# Git operations
echo -e "\n${YELLOW}Committing and pushing to GitHub...${NC}"
cd "$PROJECT_DIR" || exit 1

# Check if this is a git repo
if [ ! -d ".git" ]; then
  echo -e "${RED}ERROR: $PROJECT_DIR is not a git repository.${NC}"
  exit 1
fi

git add src/data/study/

# Check if there's anything to commit
if git diff --cached --quiet; then
  echo -e "${YELLOW}No changes to commit — files may already be up to date.${NC}"
else
  git commit -m "feat: add study resource data for all subcategories

- Added 15 JSON study files across all categories:
  Verbal: vocabulary, grammar, reading comprehension, analogy, logic
  Numerical: basic math, word problems, number series, data interpretation
  Analytical: analytical ability
  Clerical: clerical ability
  General: Philippine constitution, RA 6713, peace & human rights, environmental management"

  echo -e "\n${YELLOW}Pushing to GitHub (main branch)...${NC}"
  git push origin main

  if [ $? -eq 0 ]; then
    echo -e "\n${GREEN}==============================${NC}"
    echo -e "${GREEN}  ✔ Successfully deployed!     ${NC}"
    echo -e "${GREEN}  Vercel will auto-deploy now. ${NC}"
    echo -e "${GREEN}  Check: https://othancse.vercel.app${NC}"
    echo -e "${GREEN}==============================${NC}"
  else
    echo -e "${RED}Push failed. Check your GitHub credentials or connection.${NC}"
    exit 1
  fi
fi

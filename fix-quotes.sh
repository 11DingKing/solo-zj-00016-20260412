#!/bin/bash

# 修复所有文件中的双引号为单引号
files=(
  "src/controllers/EnrollmentsCtrl.ts"
  "src/controllers/LessonsCtrl.ts"
  "src/controllers/UsersCtrl.ts"
  "src/middlewares/auth.ts"
  "src/models/Enrollment.ts"
  "src/repositories/CoursesRepo.ts"
  "src/repositories/EnrollmentRepo.ts"
  "src/repositories/UserRepo.ts"
  "src/routes/CourseRoutes.ts"
  "src/routes/EnrollmentRoutes.ts"
  "src/routes/LessonRoutes.ts"
  "src/routes/UserRoutes.ts"
  "src/routes/index.ts"
  "src/utils/jwt.ts"
  "src/validators/userValidator.ts"
  "ecosystem.config.ts"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    # 使用 sed 替换双引号为单引号，但排除模板字符串中的反引号
    sed -i '' 's/"/'\''/g' "$file"
    echo "Fixed: $file"
  else
    echo "File not found: $file"
  fi
done

echo "Done!"

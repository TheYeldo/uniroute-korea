insert into public.sources (id, title, url, organization, checked_at, academic_year, source_type) values
('study-korea-costs', 'Living Costs and Expenses', 'https://studyinkorea.go.kr/ko/life/livingExpense.do', 'Study in Korea / NIIED', '2026-07-19', null, 'government'),
('study-korea-tuition', 'Study Expenses in Korea', 'https://studyinkorea.go.kr/ko/plan/abroadExpenses.do', 'Study in Korea / NIIED', '2026-07-19', null, 'government'),
('gks-2026', '2026 Global Korea Scholarship for Undergraduate Degrees', 'https://www.studyinkorea.go.kr/ko/notice/scholarshipsRead.do?bbsId=BBSMSTR_000000000461&boardSort=3&nttId=4385', 'GKS Center / NIIED', '2026-07-19', '2026', 'government'),
('snu-admission', 'International Undergraduate Admission Guide', 'https://admission.snu.ac.kr/international/undergraduate/fall/guide', 'Seoul National University', '2026-07-19', 'Fall 2026', 'official'),
('ku-admission', 'Undergraduate International Admission Guide', 'https://oia.korea.ac.kr/oia2026/Admission-Guide.do', 'Korea University', '2026-07-19', '2027', 'official'),
('yonsei-admission', 'International Undergraduate Admissions', 'https://admission.yonsei.ac.kr/seoul/foreign/html/eng/about.asp', 'Yonsei University', '2026-07-19', null, 'official'),
('kaist-admission', 'International Undergraduate Admission', 'https://admission.kaist.ac.kr/intl-undergraduate', 'KAIST', '2026-07-19', '2027', 'official'),
('kaist-eligibility', 'International Undergraduate Eligibility', 'https://admission.kaist.ac.kr/intl-undergraduate/before/sub02', 'KAIST', '2026-07-19', '2027', 'official'),
('postech-admission', 'International Undergraduate Admissions', 'https://adm-iu.postech.ac.kr/', 'POSTECH', '2026-07-19', '2027', 'official'),
('postech-calendar', 'International Admissions Overview', 'https://adm-iu.postech.ac.kr/user/comm/menu/3317587a17a23d4dacdb9ffc4762bf4a/content/index.do', 'POSTECH', '2026-07-19', 'Spring 2027', 'official'),
('postech-scholarship', 'International Undergraduate Support', 'https://adm-iu.postech.ac.kr/user/comm/menu/e2afb97fa1b8f43c574be0dabef78f87/content/index.do', 'POSTECH', '2026-07-19', '2026–2027', 'official'),
('skku-admission', 'Undergraduate International Admissions', 'https://admission-global.skku.edu/', 'Sungkyunkwan University', '2026-07-19', null, 'official'),
('hanyang-admission', 'Office of International Affairs — Admissions', 'https://oia.hanyang.ac.kr/', 'Hanyang University', '2026-07-19', '2026', 'official'),
('khu-admission', 'International Undergraduate Admission', 'https://iadmission.khu.ac.kr/gglobalcenter/user/contents/view.do?menuNo=8000031', 'Kyung Hee University', '2026-07-19', 'Fall 2026', 'official'),
('ewha-admission', 'International Student Admissions', 'https://ewha.ac.kr/ewhaen/admission/admission.do', 'Ewha Womans University', '2026-07-19', null, 'official'),
('ewha-guide', 'Fall 2026 Admissions for International Applicants', 'https://isa.ewha.ac.kr/sites/oisa/file/ag_english.pdf', 'Ewha Womans University', '2026-07-19', 'Fall 2026', 'official'),
('hufs-admission', 'Fall 2026 International Undergraduate Admission Guide', 'https://international.hufs.ac.kr/sites/international/contents/files/2026fall/HUFS_2026_Fall_Admission_guide%28ENG%29.pdf', 'Hankuk University of Foreign Studies', '2026-07-19', 'Fall 2026', 'official'),
('ielts-scoring', 'IELTS scoring in detail', 'https://ielts.org/take-a-test/your-results/ielts-scoring-in-detail', 'IELTS', '2026-07-19', null, 'official')
on conflict (id) do update set checked_at = excluded.checked_at, title = excluded.title, url = excluded.url;

insert into public.universities (id, slug, name, korean_name, short_name, city, campus, university_type, overview_ru, overview_en, official_website, admission_website, data_completeness, last_verified_at) values
('snu', 'seoul-national-university', 'Seoul National University', '서울대학교', 'SNU', 'Seoul', 'Gwanak', 'national', 'Государственный университет в Сеуле. Требования проверяются по актуальному треку.', 'A national university in Seoul. Requirements must be checked for the current track.', 'https://en.snu.ac.kr/', 'https://admission.snu.ac.kr/international/undergraduate/fall/guide', 'partial', '2026-07-19'),
('korea', 'korea-university', 'Korea University', '고려대학교', 'KU', 'Seoul', 'Seoul', 'private', 'Частный университет в Сеуле с международным отделом бакалавриата.', 'A private university in Seoul with a dedicated international undergraduate office.', 'https://www.korea.edu/', 'https://oia.korea.ac.kr/oia2026/Admission-Guide.do', 'verified-core', '2026-07-19'),
('yonsei', 'yonsei-university', 'Yonsei University', '연세대학교', 'Yonsei', 'Seoul', 'Sinchon', 'private', 'Частный университет в Сеуле.', 'A private university in Seoul.', 'https://www.yonsei.ac.kr/en_sc/', 'https://admission.yonsei.ac.kr/seoul/foreign/html/eng/about.asp', 'partial', '2026-07-19'),
('kaist', 'kaist', 'Korea Advanced Institute of Science and Technology', '한국과학기술원', 'KAIST', 'Daejeon', 'Daejeon', 'science-and-technology', 'Научно-технический университет в Тэджоне.', 'A science and technology university in Daejeon.', 'https://www.kaist.ac.kr/en/', 'https://admission.kaist.ac.kr/intl-undergraduate', 'verified-core', '2026-07-19'),
('postech', 'postech', 'Pohang University of Science and Technology', '포항공과대학교', 'POSTECH', 'Pohang', 'Pohang', 'science-and-technology', 'Научно-технический университет в Пхохане.', 'A science and technology university in Pohang.', 'https://www.postech.ac.kr/eng/', 'https://adm-iu.postech.ac.kr/', 'verified-core', '2026-07-19'),
('skku', 'sungkyunkwan-university', 'Sungkyunkwan University', '성균관대학교', 'SKKU', 'Seoul / Suwon', 'Humanities and Social Sciences / Natural Sciences', 'private', 'Частный университет с кампусами в Сеуле и Сувоне.', 'A private university with campuses in Seoul and Suwon.', 'https://www.skku.edu/eng/', 'https://admission-global.skku.edu/', 'partial', '2026-07-19'),
('hanyang', 'hanyang-university', 'Hanyang University', '한양대학교', 'HYU', 'Seoul / Ansan', 'Seoul / ERICA', 'private', 'Частный университет с кампусами Seoul и ERICA.', 'A private university with Seoul and ERICA campuses.', 'https://www.hanyang.ac.kr/web/eng', 'https://oia.hanyang.ac.kr/', 'partial', '2026-07-19'),
('khu', 'kyung-hee-university', 'Kyung Hee University', '경희대학교', 'KHU', 'Seoul / Yongin', 'Seoul / Global', 'private', 'Частный университет с кампусами в Сеуле и Йонъине.', 'A private university with Seoul and Global campuses.', 'https://www.khu.ac.kr/eng/user/main/view.do', 'https://iadmission.khu.ac.kr/gglobalcenter/user/main/view.do', 'verified-core', '2026-07-19'),
('ewha', 'ewha-womans-university', 'Ewha Womans University', '이화여자대학교', 'Ewha', 'Seoul', 'Sinchon', 'private', 'Частный женский университет в Сеуле.', 'A private women’s university in Seoul.', 'https://www.ewha.ac.kr/ewhaen/index.do', 'https://ewha.ac.kr/ewhaen/admission/admission.do', 'partial', '2026-07-19'),
('hufs', 'hankuk-university-of-foreign-studies', 'Hankuk University of Foreign Studies', '한국외국어대학교', 'HUFS', 'Seoul / Yongin', 'Seoul / Global', 'private', 'Частный университет с кампусами в Сеуле и Йонъине.', 'A private university with Seoul and Global campuses.', 'https://www.hufs.ac.kr/', 'https://international.hufs.ac.kr/', 'partial', '2026-07-19')
on conflict (id) do update set last_verified_at = excluded.last_verified_at, admission_website = excluded.admission_website;

insert into public.university_sources (university_id, source_id, data_category) values
('snu', 'snu-admission', 'admission'),
('korea', 'ku-admission', 'admission'),
('yonsei', 'yonsei-admission', 'admission'),
('kaist', 'kaist-admission', 'admission'),
('kaist', 'kaist-eligibility', 'eligibility'),
('postech', 'postech-admission', 'admission'),
('postech', 'postech-calendar', 'deadlines'),
('postech', 'postech-scholarship', 'scholarships'),
('skku', 'skku-admission', 'admission'),
('hanyang', 'hanyang-admission', 'admission'),
('khu', 'khu-admission', 'admission'),
('ewha', 'ewha-admission', 'admission'),
('ewha', 'ewha-guide', 'admission-guide'),
('hufs', 'hufs-admission', 'admission')
on conflict do nothing;

insert into public.programs (
  id, university_id, slug, degree_level, field, title, department,
  instruction_language, duration_years, tuition_min_krw, tuition_max_krw,
  tuition_period, tuition_source_id, program_url, last_verified_at
) values
('snu-cse', 'snu', 'computer-science-and-engineering', 'bachelor', 'Computer Science', 'Computer Science and Engineering', 'College of Engineering', 'varies', 4, null, null, null, null, 'https://cse.snu.ac.kr/en', '2026-07-19'),
('ku-cse', 'korea', 'computer-science-and-engineering', 'bachelor', 'Computer Science', 'Computer Science and Engineering', 'College of Informatics', 'varies', 4, null, null, null, null, 'https://oia.korea.ac.kr/oia2026/Schools-Department.do', '2026-07-19'),
('yonsei-cs', 'yonsei', 'computer-science', 'bachelor', 'Computer Science', 'Computer Science', 'College of Computing', 'varies', 4, null, null, null, null, 'https://cs.yonsei.ac.kr/', '2026-07-19'),
('kaist-undeclared-cs', 'kaist', 'undeclared-computer-science-path', 'bachelor', 'Computer Science', 'Undeclared undergraduate — Computer Science path', 'School of Computing after major declaration', 'varies', 4, null, null, null, null, 'https://admission.kaist.ac.kr/intl-undergraduate/before/sub02', '2026-07-19'),
('postech-cse', 'postech', 'computer-science-and-engineering', 'bachelor', 'Computer Science', 'Computer Science and Engineering', 'Department of Computer Science and Engineering', 'english', 4, 0, 0, 'year', 'postech-scholarship', 'https://adm-iu.postech.ac.kr/', '2026-07-19'),
('skku-ai', 'skku', 'artificial-intelligence', 'bachelor', 'Artificial Intelligence', 'Artificial Intelligence', 'College admission unit — verify current guide', 'varies', 4, null, null, null, null, 'https://admission-global.skku.edu/', '2026-07-19'),
('hanyang-cse', 'hanyang', 'computer-science-and-engineering', 'bachelor', 'Computer Science', 'Computer Science and Engineering', 'Verify campus and admission unit', 'varies', 4, null, null, null, null, 'https://oia.hanyang.ac.kr/', '2026-07-19'),
('khu-economics', 'khu', 'economics', 'bachelor', 'Economics', 'Economics', 'College of Politics and Economics', 'varies', 4, null, null, null, null, 'https://iadmission.khu.ac.kr/gglobalcenter/user/contents/view.do?menuNo=8000026', '2026-07-19'),
('ewha-cse', 'ewha', 'computer-science-and-engineering', 'bachelor', 'Computer Science', 'Computer Science and Engineering', 'Verify current international admission unit', 'varies', 4, null, null, null, null, 'https://isa.ewha.ac.kr/sites/oisa/file/ag_english.pdf', '2026-07-19'),
('hufs-international-studies', 'hufs', 'international-studies', 'bachelor', 'International Relations', 'International Studies', 'Verify campus and current admission unit', 'varies', 4, null, null, null, null, 'https://international.hufs.ac.kr/', '2026-07-19')
on conflict (id) do update set
  title = excluded.title,
  department = excluded.department,
  instruction_language = excluded.instruction_language,
  program_url = excluded.program_url,
  last_verified_at = excluded.last_verified_at;

insert into public.requirements (
  id, program_id, category, requirement_text_ru, requirement_text_en, test_name,
  minimum_value, recommended_value, varies_by_department, verification_status,
  source_id, academic_year, last_verified_at
) values
('9aebad3c-94d7-49e7-89d7-3132e6d8e611', 'kaist-undeclared-cs', 'language', 'Официальная страница приводит IELTS 6.5 как рекомендуемый ориентир, а не универсальный минимум.', 'The official page lists IELTS 6.5 as a recommended reference, not a universal minimum.', 'IELTS', null, 6.5, false, 'official', 'kaist-admission', '2027', '2026-07-19'),
('fb5322b4-0394-43bd-9749-9bac127ab202', 'kaist-undeclared-cs', 'language', 'Официальная страница приводит TOEFL iBT 83 как рекомендуемый ориентир, а не универсальный минимум.', 'The official page lists TOEFL iBT 83 as a recommended reference, not a universal minimum.', 'TOEFL iBT', null, 83, false, 'official', 'kaist-admission', '2027', '2026-07-19'),
('756de5b4-b17e-4e07-9db0-11cd8f5f1292', 'skku-ai', 'language', 'Допустимые языковые документы и уровни зависят от подразделения; проверьте актуальный гайд.', 'Accepted language evidence and levels vary by admission unit; verify the current guide.', 'IELTS', null, null, true, 'official', 'skku-admission', null, '2026-07-19'),
('022191de-037e-4654-91b4-ac54c1eaf452', 'skku-ai', 'language', 'Допустимые языковые документы и уровни зависят от подразделения; проверьте актуальный гайд.', 'Accepted language evidence and levels vary by admission unit; verify the current guide.', 'TOPIK', null, null, true, 'official', 'skku-admission', null, '2026-07-19')
on conflict (id) do update set
  requirement_text_ru = excluded.requirement_text_ru,
  requirement_text_en = excluded.requirement_text_en,
  last_verified_at = excluded.last_verified_at;

insert into public.scholarships (
  id, slug, title, provider, category, funding, coverage_ru, coverage_en,
  eligibility_ru, eligibility_en, application_period_ru, application_period_en,
  deadline, source_id, last_verified_at
) values
('gks-u', 'global-korea-scholarship-undergraduate', 'Global Korea Scholarship — Undergraduate (GKS-U)', 'National Institute for International Education (NIIED)', 'government', 'full', 'Государственная поддержка обучения и курс корейского языка; точные льготы и квоты определяет ежегодный гайд.', 'Government degree-study support and Korean language training; exact benefits and quotas are defined by the annual guide.', 'Действуют условия по гражданству, возрасту, образованию, успеваемости, здоровью и треку. Возможное совпадение не подтверждает право.', 'Nationality, age, education, grades, health, and track conditions apply. A potential match does not confirm eligibility.', 'Гайд 2026 находится в архиве; проверяйте новое объявление GKS.', 'The 2026 guide is archived; check the GKS notice board for the next call.', null, 'gks-2026', '2026-07-19'),
('postech-international-support', 'postech-international-undergraduate-support', 'POSTECH International Undergraduate Support', 'POSTECH', 'tuition-waiver', 'full', 'Официальная страница описывает освобождение от оплаты, учебный ваучер и поддержку для отдельных треков; действуют условия продления.', 'The official page describes tuition waiver support, a learning voucher, and track-dependent support; continuation conditions apply.', 'Право зависит от трека поступления, статуса зачисления и дальнейших академических условий POSTECH.', 'Eligibility depends on the admission track, enrollment status, and continuing academic conditions described by POSTECH.', 'Связан с соответствующим международным набором; проверьте актуальную страницу поддержки.', 'Aligned with the relevant international admission cycle; verify the current support page.', null, 'postech-scholarship', '2026-07-19'),
('ku-international-scholarships', 'korea-university-international-scholarships', 'Korea University International Student Scholarships', 'Korea University', 'university', 'varies', 'Варианты публикуются на портале международного бакалавриата; покрытие и отбор меняются по наборам.', 'Options are published in the international undergraduate portal; coverage and selection change by cycle.', 'Критерии отбора и продления различаются; проверьте текущий гайд.', 'Selection and renewal requirements vary; review the current application guide.', 'Зависит от набора.', 'Varies by admission cycle.', null, 'ku-admission', '2026-07-19')
on conflict (id) do update set
  coverage_ru = excluded.coverage_ru,
  coverage_en = excluded.coverage_en,
  eligibility_ru = excluded.eligibility_ru,
  eligibility_en = excluded.eligibility_en,
  last_verified_at = excluded.last_verified_at;

insert into public.scholarship_universities (scholarship_id, university_id) values
('postech-international-support', 'postech'),
('ku-international-scholarships', 'korea')
on conflict do nothing;

insert into public.deadlines (id, university_id, title_ru, title_en, category, intake, academic_year, starts_at, ends_at, timezone, is_official, source_id) values
('ku-spring-2027-application', 'korea', 'Онлайн-заявка Korea University — весна 2027', 'Korea University Spring 2027 online application', 'application', 'spring', '2027', '2026-08-03 10:00:00+09', '2026-08-31 17:00:00+09', 'Asia/Seoul', true, 'ku-admission'),
('ku-spring-2027-documents', 'korea', 'Подача документов Korea University — весна 2027', 'Korea University Spring 2027 document submission', 'documents', 'spring', '2027', '2026-08-03 10:00:00+09', '2026-09-07 17:00:00+09', 'Asia/Seoul', true, 'ku-admission'),
('postech-spring-2027-application', 'postech', 'Международная заявка POSTECH — весна 2027', 'POSTECH Spring 2027 international application', 'application', 'spring', '2027', '2026-08-25 00:00:00+09', '2026-09-02 23:59:00+09', 'Asia/Seoul', true, 'postech-calendar')
on conflict (id) do update set starts_at = excluded.starts_at, ends_at = excluded.ends_at, source_id = excluded.source_id;

insert into public.data_verification (
  entity_type, entity_id, source_id, checked_at, next_review_at, confidence, status, note
) values
('university', 'snu', 'snu-admission', '2026-07-19', '2026-10-19', 'medium', 'verified', 'Core identity and admission route verified; several values remain intentionally unconfirmed.'),
('university', 'korea', 'ku-admission', '2026-07-19', '2026-09-19', 'high', 'verified', 'Core international undergraduate route verified.'),
('university', 'yonsei', 'yonsei-admission', '2026-07-19', '2026-10-19', 'medium', 'verified', 'Core identity and admission route verified.'),
('university', 'kaist', 'kaist-admission', '2026-07-19', '2026-09-19', 'high', 'verified', 'Core international undergraduate route verified.'),
('university', 'postech', 'postech-admission', '2026-07-19', '2026-09-19', 'high', 'verified', 'Core admission route and international track verified.'),
('university', 'skku', 'skku-admission', '2026-07-19', '2026-10-19', 'medium', 'verified', 'Department-level language conditions still require individual verification.'),
('university', 'hanyang', 'hanyang-admission', '2026-07-19', '2026-10-19', 'medium', 'verified', 'Campus-specific conditions remain intentionally unconfirmed.'),
('university', 'khu', 'khu-admission', '2026-07-19', '2026-09-19', 'high', 'verified', 'Fall 2026 international guide verified.'),
('university', 'ewha', 'ewha-guide', '2026-07-19', '2026-10-19', 'medium', 'verified', 'Current admission guide route verified.'),
('university', 'hufs', 'hufs-admission', '2026-07-19', '2026-10-19', 'medium', 'verified', 'Fall 2026 guide verified; later cycles require review.'),
('scholarship', 'gks-u', 'gks-2026', '2026-07-19', '2026-09-01', 'high', 'outdated', 'The 2026 guide is retained as an archive; do not present it as the next active cycle.'),
('scholarship', 'postech-international-support', 'postech-scholarship', '2026-07-19', '2026-09-19', 'high', 'verified', 'Continuation and track conditions apply.'),
('deadline', 'ku-spring-2027-application', 'ku-admission', '2026-07-19', '2026-08-15', 'high', 'verified', 'Official dates include Asia/Seoul timezone.'),
('deadline', 'postech-spring-2027-application', 'postech-calendar', '2026-07-19', '2026-08-15', 'high', 'verified', 'Official dates include Asia/Seoul timezone.')
on conflict (entity_type, entity_id, source_id) do update set
  checked_at = excluded.checked_at,
  next_review_at = excluded.next_review_at,
  confidence = excluded.confidence,
  status = excluded.status,
  note = excluded.note;

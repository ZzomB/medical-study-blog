# 검색엔진 최적화(SEO) 설정 가이드

이 가이드는 블로그를 구글과 네이버 등 검색엔진에 등록하고 노출시키는 방법을 설명합니다.

## 이미 설정된 사항

- ✅ Sitemap.xml 자동 생성 (`/sitemap.xml`)
- ✅ Robots.txt 설정 (`/robots.txt`)
- ✅ 메타 태그 (Title, Description, Keywords)
- ✅ Open Graph 태그 (소셜 미디어 공유용)
- ✅ Twitter Card 태그
- ✅ 구조화된 데이터 (Schema.org JSON-LD)
- ✅ Canonical URL 설정

## 추가 설정 필요 사항

### 1. 환경 변수 설정

`.env.local` 파일에 다음 환경 변수를 추가하세요:

```env
# 사이트 URL (필수)
NEXT_PUBLIC_SITE_URL=https://yourdomain.com

# 네이버 사이트 검증 코드 (선택, 네이버 검색엔진에 등록하려면 필요)
NEXT_PUBLIC_NAVER_SITE_VERIFICATION=your_naver_verification_code

# 구글 사이트 검증 코드 (선택)
# 구글 검색콘솔에서 받은 코드를 SEOHead.tsx에 직접 추가
```

### 2. 구글 검색콘솔에 사이트 등록

#### 2-1. 구글 검색콘솔 접속

1. [Google Search Console](https://search.google.com/search-console)에 접속
2. Google 계정으로 로그인
3. "속성 추가" 클릭

#### 2-2. 사이트 등록 방법

**방법 A: URL 접두어 사용 (추천)**

- 속성 유형: URL 접두어 선택
- 사이트 URL 입력: `https://yourdomain.com`
- 계속 클릭

**방법 B: 도메인 사용**

- 속성 유형: 도메인 선택
- 도메인 입력: `yourdomain.com`

#### 2-3. 사이트 소유권 확인

- HTML 파일 업로드
- HTML 태그 (메타 태그) - `components/SEOHead.tsx`에 추가
- Google Analytics 사용 (이미 설정된 경우)
- Google 태그 관리자 사용

**메타 태그 방법 사용 시:**

1. 구글에서 제공한 메타 태그 코드 복사 (예: `<meta name="google-site-verification" content="..." />`)
2. `components/SEOHead.tsx` 파일 열기
3. 주석 처리된 구글 검증 부분에 코드 추가

#### 2-4. Sitemap 제출

1. 검색콘솔 좌측 메뉴에서 "Sitemaps" 클릭
2. "새 사이트맵 추가" 클릭
3. `sitemap.xml` 입력 후 제출
4. 또는 `https://yourdomain.com/sitemap.xml` 입력

#### 2-5. 색인 생성 요청 (선택)

- "URL 검사" 도구 사용
- 색인 생성 요청 클릭

### 3. 네이버 서치어드바이저에 사이트 등록

#### 3-1. 네이버 서치어드바이저 접속

1. [네이버 서치어드바이저](https://searchadvisor.naver.com/) 접속
2. 네이버 계정으로 로그인
3. "웹마스터 도구" 클릭

#### 3-2. 사이트 등록

1. "사이트 추가" 클릭
2. 사이트 URL 입력: `https://yourdomain.com`
3. "확인" 클릭

#### 3-3. 사이트 소유권 확인

네이버는 여러 방법을 제공합니다:

**방법 A: HTML 파일 업로드 (추천)**

1. 네이버에서 제공한 HTML 파일 다운로드
2. 프로젝트의 `public` 폴더에 업로드
3. 빌드 및 배포 후 네이버에서 확인

**방법 B: 메타 태그 사용**

1. 네이버에서 제공한 메타 태그 코드 복사
   - 예: `<meta name="naver-site-verification" content="your_code" />`
2. `.env.local` 파일에 추가:
   ```env
   NEXT_PUBLIC_NAVER_SITE_VERIFICATION=your_naver_code
   ```
3. 환경 변수가 자동으로 적용됩니다

#### 3-4. Sitemap 제출

1. 좌측 메뉴에서 "요청" > "사이트맵 제출" 클릭
2. 사이트맵 URL 입력: `https://yourdomain.com/sitemap.xml`
3. "확인" 클릭

#### 3-5. RSS 피드 제출 (선택)

- 네이버에서 RSS 피드를 요청하는 경우, 블로그 RSS 피드 URL을 제출할 수 있습니다

### 4. 빙(Bing) 웹마스터 도구 (선택)

1. [Bing Webmaster Tools](https://www.bing.com/webmasters) 접속
2. Microsoft 계정으로 로그인
3. 사이트 추가 및 Sitemap 제출 (`https://yourdomain.com/sitemap.xml`)

### 5. 확인 방법

#### 사이트맵 확인

- 브라우저에서 `https://yourdomain.com/sitemap.xml` 접속
- XML 형식의 사이트맵이 보여야 합니다

#### Robots.txt 확인

- 브라우저에서 `https://yourdomain.com/robots.txt` 접속
- 사이트맵 URL이 포함되어 있어야 합니다

#### 메타 태그 확인

1. 브라우저에서 게시글 페이지 열기
2. 페이지 소스 보기 (우클릭 > 페이지 소스 또는 F12)
3. `<head>` 태그 내에 다음이 포함되어 있는지 확인:
   - Title, Description 메타 태그
   - Open Graph 태그
   - 구조화된 데이터 (JSON-LD)

#### 구조화된 데이터 테스트

- [Google Rich Results Test](https://search.google.com/test/rich-results)에서 테스트
- 게시글 URL 입력 후 검증

### 6. 색인 생성 대기 시간

- **구글**: 일반적으로 1주일 ~ 몇 주 소요
- **네이버**: 일반적으로 2주 ~ 몇 달 소요
- 사이트맵을 제출하면 더 빠르게 색인이 생성됩니다

### 7. 추가 최적화 팁

1. **정기적인 콘텐츠 업데이트**
   - 새로운 게시글을 꾸준히 발행하면 검색엔진이 더 자주 크롤링합니다

2. **내부 링크**
   - 다른 게시글에 관련 링크를 추가하면 SEO에 도움이 됩니다

3. **외부 링크**
   - 신뢰할 수 있는 사이트로의 링크는 SEO에 도움이 됩니다

4. **이미지 최적화**
   - 이미지에 alt 텍스트 추가 (이미 구현됨)
   - 이미지 파일 크기 최적화

5. **모바일 최적화**
   - 반응형 디자인 사용 (이미 구현됨)

6. **페이지 속도**
   - Next.js의 이미지 최적화 기능 활용 (이미 구현됨)

## 문제 해결

### 사이트맵이 생성되지 않는 경우

- `NEXT_PUBLIC_SITE_URL` 환경 변수가 올바르게 설정되어 있는지 확인
- 빌드 후 확인 (개발 모드에서는 다를 수 있음)

### 검색 결과에 나타나지 않는 경우

- 사이트맵 제출 후 최소 1주일 이상 대기
- 구글 검색콘솔에서 색인 생성 상태 확인
- "URL 검사" 도구로 개별 페이지 색인 생성 요청

### 네이버 검색에 나타나지 않는 경우

- 네이버는 구글보다 색인 생성이 느립니다 (몇 달 소요 가능)
- 정기적으로 사이트맵을 재제출
- 네이버 블로그나 카페에서 내 블로그 링크 공유

## 참고 자료

- [Google Search Central](https://developers.google.com/search)
- [네이버 서치어드바이저 도움말](https://searchadvisor.naver.com/guide)
- [Next.js SEO 가이드](https://nextjs.org/learn/seo/introduction-to-seo)

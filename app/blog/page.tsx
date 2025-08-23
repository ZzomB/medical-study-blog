export default function Blog() {
  return (
    // min-h-screen으로 전체 높이 보장, grid로 3개 영역 분할

    <div className="container py-8">
      <div className="space-y-8">
        {/* 섹션 제목 */}
        <h2 className="text-3xl font-bold tracking-tight">블로그 목록</h2>
      </div>
    </div>
  );
}

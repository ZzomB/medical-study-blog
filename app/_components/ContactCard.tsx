import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Instagram, Mail, Youtube } from 'lucide-react';

// 연락처 항목 정의 (링크는 나중에 추가 예정)
const contactItems = [
  {
    name: 'Instagram',
    icon: Instagram,
    href: '#', // 나중에 추가
  },
  {
    name: 'Email',
    icon: Mail,
    href: '#', // 나중에 추가
  },
  {
    name: 'YouTube',
    icon: Youtube,
    href: '#', // 나중에 추가
  },
];

export default function ContactCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>📩 Contacts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3">
          {contactItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="group flex cursor-pointer items-center gap-2 rounded-md p-1.5 text-base transition-colors text-muted-foreground hover:bg-muted-foreground/10"
              >
                <Icon className="h-4 w-4 transition-colors" />
                <span className="font-medium">{item.name}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}


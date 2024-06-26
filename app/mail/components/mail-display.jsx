
import format from "date-fns/format"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "./ui/avatar"
import { Separator } from "./ui/separator"
import { Badge } from "./ui/badge"
export function MailDisplay({ mail }) {

  return (
    <div className="flex h-full flex-col">
      <Separator />
      {mail ? (
        <div className="flex flex-1 flex-col mt-10">
          <div className="flex items-start p-4">
            <div className="flex items-start gap-4 text-sm">
              <Avatar>
                <AvatarImage alt={mail.name} />
                <AvatarFallback>
                  {mail.name
                    .split(" ")
                    .map((chunk) => chunk[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <div className="font-semibold">{mail.name}</div>
                <div className="line-clamp-1 text-xs">{mail.subject}</div>
                <div className="line-clamp-1 text-xs">
                  <span className="font-medium">Reply-To:</span> {mail.email}
                </div>
              </div>
            </div>
            {mail.date && (
              <div className="ml-auto text-xs text-muted-foreground">
                {format(new Date(mail.date), "PPpp")}
              </div>
            )}
            {mail.labels.length ? (
              <div className="flex items-center gap-2 ml-10">
                {mail.labels.map((label) => (
                  <Badge key={label}>
                    {label}
                  </Badge>
                ))}
              </div>
            ) : null}

          </div>
          <Separator />
          <div className="flex-1" dangerouslySetInnerHTML={{__html: mail.text}}>

          </div>
          <Separator className="mt-auto" />
        </div>
  ) : (
    <div className="p-8 text-center text-muted-foreground">
      No message selected
    </div>
  )
}
    </div >
  )
}

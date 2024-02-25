import { Injectable } from "@angular/core";
import { NativeDateAdapter } from "@angular/material/core";

@Injectable({
  providedIn: 'root'
})
export class FrDateAdapter extends NativeDateAdapter {
  public override getFirstDayOfWeek (): number {
    return 1
  }
}

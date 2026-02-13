import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Contact } from '../../models/contact.model';
import { ContactService } from '../../services/contact.service';

@Component({
  selector: 'app-contact-detail',
  imports: [RouterLink, DatePipe],
  templateUrl: './contact-detail.html',
  styleUrl: './contact-detail.css',
})
export class ContactDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly contactService = inject(ContactService);

  contact = signal<Contact | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadContact(id);
    }
  }

  private loadContact(id: string): void {
    this.contactService.getContact(id).subscribe({
      next: (contact) => {
        this.contact.set(contact);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load contact.');
        this.loading.set(false);
      },
    });
  }

  deleteContact(): void {
    const contact = this.contact();
    if (!contact?.id) return;
    if (!confirm(`Are you sure you want to delete ${contact.name} ${contact.lastName}?`)) return;

    this.contactService.deleteContact(contact.id).subscribe({
      next: () => this.router.navigate(['/']),
      error: () => this.error.set('Failed to delete contact.'),
    });
  }

  getInitials(): string {
    const c = this.contact();
    if (!c) return '';
    return `${c.name.charAt(0)}${c.lastName.charAt(0)}`.toUpperCase();
  }

  getFullAddress(): string {
    const c = this.contact();
    if (!c) return '';
    return [c.addressLine1, c.addressLine2, c.city, c.state, c.country]
      .filter(Boolean)
      .join(', ');
  }
}

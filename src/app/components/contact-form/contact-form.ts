import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ContactService } from '../../services/contact.service';

@Component({
  selector: 'app-contact-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.css',
})
export class ContactForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly contactService = inject(ContactService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  form!: FormGroup;
  isEditMode = signal(false);
  contactId = signal<string | null>(null);
  loading = signal(false);
  submitting = signal(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      lastName: ['', [Validators.required, Validators.maxLength(100)]],
      phone: ['', [Validators.maxLength(20), Validators.pattern(/^$|^\+?[0-9\-\s()]{7,20}$/)]],
      email: ['', [Validators.email, Validators.maxLength(255)]],
      addressLine1: ['', Validators.maxLength(255)],
      addressLine2: ['', Validators.maxLength(255)],
      country: ['', Validators.maxLength(100)],
      state: ['', Validators.maxLength(100)],
      city: ['', Validators.maxLength(100)],
      birthday: [''],
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.contactId.set(id);
      this.loadContact(id);
    }
  }

  private loadContact(id: string): void {
    this.loading.set(true);
    this.contactService.getContact(id).subscribe({
      next: (contact) => {
        this.form.patchValue(contact);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load contact.');
        this.loading.set(false);
      },
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.error.set(null);
    const contactData = this.form.value;

    const request$ = this.isEditMode()
      ? this.contactService.updateContact(this.contactId()!, contactData)
      : this.contactService.createContact(contactData);

    request$.subscribe({
      next: (contact) => {
        this.submitting.set(false);
        this.router.navigate(['/contacts', contact.id]);
      },
      error: () => {
        this.error.set('Failed to save contact. Please try again.');
        this.submitting.set(false);
      },
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) return 'This field is required.';
    if (field.errors['email']) return 'Please enter a valid email address.';
    if (field.errors['maxlength']) return `Maximum ${field.errors['maxlength'].requiredLength} characters.`;
    if (field.errors['pattern']) return 'Please enter a valid phone number.';
    return '';
  }
}

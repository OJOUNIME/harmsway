Balance = 16000
saving_pin = "1234"

print("...........Welcome To Opay............")
print("...........Beyond Banking..........")

menu = """
1. Check Balance
2. Withdraw
3. Deposit
4. Exit"""
print(menu)
choice = input("\nselect an option(1-4): ")
if choice == "1":
    print("Check_Balance")
    print("Your current balance is:  ₦" + str(Balance))
    
elif choice == "2":
    print("Wihdraw")
    input_amount = input("Enter Withdrawal amount: ")
    amount = int(input_amount)
    if amount > Balance:
        print("Error: Insufficient funds. ")
    else:
        user_pin = input("Enter your 4-digit pin: ")
        if user_pin == saving_pin:
            Balance = Balance - amount
            print("Withdrawal Successful!")
            print("Amount Debited: ₦" + str(amount))
            print("Your new balance is: ₦" + str(Balance))
        else:
            print("Error: Incorrect Pin.")
elif choice == "3":
    print("Deposit")
    amount = int(input("Enter the amount you want to deposit: "))
    if amount <= 0:
        print("Error: Invalid deposit amount.")
    else: 
        Balance = Balance + amount
        print("Deposit Successful!")
        print(f"Amount Credited:  ₦{amount}")
        print(f"Your new Balance: ₦{Balance}")
elif choice == "4":
    print("Thank You For Using Opay. Goodbye!")
else:
    print("Invalid Choice.")
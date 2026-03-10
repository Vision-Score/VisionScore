package visionscore;

import java.util.concurrent.ThreadLocalRandom;

public class Main {

    public static void main(String[] args) {

        int aux = 0;
        int randomUser = -1;
        int randomError = -1;
        while (aux < 50000) {
            if (aux % 500 == 0) {
                randomUser = ThreadLocalRandom.current().nextInt(0, 5);
                randomError = ThreadLocalRandom.current().nextInt(0, 3);
                GetLogs.LogGenerico(randomError, randomError, randomUser);
            }
            aux++;
        }
    }

}

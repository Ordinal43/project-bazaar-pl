<template>
    <v-container grid-list-lg class="my-5">
        <v-layout align-center>
            <v-btn fab dark color="primary" @click="$router.go(-1)">
                <v-icon>arrow_back</v-icon>
            </v-btn>
            <div class="ml-4 headline font-weight-bold">
                Semua Stand
            </div>
        </v-layout>

        <v-divider class="my-4"></v-divider>
        
        <v-layout row wrap justify-center>
            <v-flex xs12 sm8 lg6>
                <v-text-field
                    solo
                    label="Cari stand"
                    clearable
                    v-model="querySearch"
                >
                    <v-icon>search</v-icon>
                </v-text-field>
            </v-flex>
        </v-layout>

        <v-layout row wrap>
            <v-flex xs12 md6 xl4 v-for="(item, id) in getFilteredStands" :key="`stand-${id}`">
                <stand-card :item="item"></stand-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
import StandCard from './StandCard'

export default {
    components: {
        StandCard,
    },
    data() {
        return {
            stands: [],
            querySearch: "",
        }
    },
    computed: {
        getFilteredStands() {
            if(!!this.querySearch) {
                return this.stands.filter((item) => {
                    const hasName = item.name.toLowerCase().replace(/ /g,'').indexOf(this.querySearch.toLowerCase()) >= 0

                    const hasDesc = item.description.toLowerCase().replace(/ /g,'').indexOf(this.querySearch.toLowerCase()) >= 0
                    
                    return (hasName || hasDesc);
                });
            } else {
                return this.stands;
            }
        },
    },
    methods: {
        async getStands() {
            const res = await axios.get('/api/stands');
            this.stands = res.data;
        }
    },
    mounted() {
        this.getStands();
    }
}
</script>
